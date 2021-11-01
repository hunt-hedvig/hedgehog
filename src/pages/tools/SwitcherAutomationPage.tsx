import {
  Checkbox,
  MainHeadline,
  SecondLevelHeadline,
  Table,
  TableHeader,
  TableHeaderColumn,
} from '@hedvig-ui'
import { sleep } from '@hedvig-ui/utils/sleep'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { format, isPast, parseISO } from 'date-fns'
import { Market, MarketFlags } from 'features/config/constants'
import {
  SwitcherEmailRow,
  SwitcherEmailStatus,
} from 'features/tools/switcher-automation/SwitcherTableRow'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  Contract,
  Member,
  SwitchableSwitcherEmail,
  useActivatePendingAgreementMutation,
  useGetSwitcherEmailsQuery,
  useTerminateContractMutation,
} from 'types/generated/graphql'

export enum SwitcherTypes {
  SwedishHouse = 'SWEDISH_HOUSE',
  SwedishApartment = 'SWEDISH_APARTMENT',
  NorwegianHomeContent = 'NORWEGIAN_HOME_CONTENT',
  NorwegianTravel = 'NORWEGIAN_TRAVEL',
}

export const SwitcherTypeMarket: Record<SwitcherTypes, Market> = {
  [SwitcherTypes.SwedishHouse]: Market.Sweden,
  [SwitcherTypes.SwedishApartment]: Market.Sweden,
  [SwitcherTypes.NorwegianHomeContent]: Market.Norway,
  [SwitcherTypes.NorwegianTravel]: Market.Norway,
}

export const getSwitcherEmailStatus = (
  switcherEmail: Pick<
    SwitchableSwitcherEmail,
    'cancellationDate' | 'note' | 'sentAt' | 'remindedAt'
  >,
): SwitcherEmailStatus => {
  if (
    switcherEmail.cancellationDate &&
    isPast(parseISO(switcherEmail.cancellationDate))
  ) {
    return SwitcherEmailStatus.PastCancellationDate
  }
  if (switcherEmail.note) {
    return SwitcherEmailStatus.InProgress
  }
  if (switcherEmail.remindedAt) {
    return SwitcherEmailStatus.Reminded
  }
  if (switcherEmail.sentAt) {
    return SwitcherEmailStatus.Sent
  }
  return SwitcherEmailStatus.Prepared
}

const SwitcherAutomationPage: React.FC = () => {
  const switchers = useGetSwitcherEmailsQuery()

  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<SwitcherEmailStatus | null>(null)

  const [
    activateContract,
    { loading: activateContractLoading },
  ] = useActivatePendingAgreementMutation()

  const [
    terminateContract,
    { loading: terminateContractLoading },
  ] = useTerminateContractMutation()

  return (
    <>
      <MainHeadline>🏡 Switcher automation</MainHeadline>
      {switchers.loading ? (
        <>Loading...</>
      ) : (
        <>
          <SecondLevelHeadline>Market</SecondLevelHeadline>
          {Object.values(Market).map((market) => {
            return (
              <div key={market}>
                <Checkbox
                  label={`${convertEnumToTitle(market)} ${MarketFlags[market]}`}
                  checked={selectedMarket === market}
                  onChange={() =>
                    setSelectedMarket((current) =>
                      current === market ? null : market,
                    )
                  }
                />
              </div>
            )
          })}
          <SecondLevelHeadline>Status</SecondLevelHeadline>
          {Object.values(SwitcherEmailStatus).map((status) => {
            return (
              <div key={status}>
                <Checkbox
                  label={status}
                  checked={selectedStatus === status}
                  onChange={() =>
                    setSelectedStatus((current) =>
                      current === status ? null : status,
                    )
                  }
                />
              </div>
            )
          })}
          <Table style={{ overflow: 'visible', marginTop: '1em' }}>
            <TableHeader>
              <TableHeaderColumn>Member</TableHeaderColumn>
              <TableHeaderColumn>Insurance</TableHeaderColumn>
              <TableHeaderColumn>Sign date</TableHeaderColumn>
              <TableHeaderColumn>Sent date</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Contract</TableHeaderColumn>
            </TableHeader>
            {switchers.data?.switchableSwitcherEmails
              ?.filter((email) => {
                if (!email.switcherType) {
                  return true
                }
                if (!SwitcherTypeMarket[email.switcherType]) {
                  return true
                }
                const status = getSwitcherEmailStatus(email)
                return (
                  (!selectedMarket ||
                    SwitcherTypeMarket[email.switcherType] ===
                      selectedMarket) &&
                  (!selectedStatus || selectedStatus === status)
                )
              })
              .map((email) => (
                <SwitcherEmailRow
                  key={email.id}
                  {...email}
                  status={getSwitcherEmailStatus(email)}
                  member={email.member as Member}
                  contract={email.contract as Contract}
                  loading={activateContractLoading || terminateContractLoading}
                  onActivate={async (contract, activeFrom) => {
                    await toast.promise(
                      activateContract({
                        variables: {
                          contractId: contract.id,
                          request: {
                            pendingAgreementId: contract.currentAgreementId,
                            fromDate: format(activeFrom, 'yyyy-MM-dd'),
                          },
                        },
                      }),
                      {
                        loading: 'Activating contract',
                        success: 'Contract activated',
                        error: 'Could not activate contract',
                      },
                    )

                    await sleep(1000)
                    await switchers.refetch()
                  }}
                  onTerminate={async (
                    contract,
                    terminationDate,
                    terminationReason,
                    comment,
                  ) => {
                    await toast.promise(
                      terminateContract({
                        variables: {
                          contractId: contract.id,
                          request: {
                            terminationDate: format(
                              terminationDate,
                              'yyyy-MM-dd',
                            ),
                            terminationReason: terminationReason!,
                            comment,
                          },
                        },
                      }),
                      {
                        loading: 'Terminating contract',
                        success: 'Contract terminated',
                        error: 'Could not terminate contract',
                      },
                    )

                    await sleep(1000)
                    await switchers.refetch()
                  }}
                />
              )) ?? null}
          </Table>
        </>
      )}
    </>
  )
}

export default SwitcherAutomationPage
