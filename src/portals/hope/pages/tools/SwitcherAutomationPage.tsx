import {
  Checkbox,
  MainHeadline,
  SecondLevelHeadline,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
} from '@hedvig-ui'
import { useTitle } from '@hedvig-ui'
import { sleep } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import { isPast, parseISO } from 'date-fns'
import { Market, MarketFlags } from 'portals/hope/features/config/constants'
import {
  SwitcherEmailRow,
  SwitcherEmailStatus,
} from 'portals/hope/features/tools/switcher-automation/SwitcherTableRow'
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
import { Page } from 'portals/hope/pages/routes'

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

const SwitcherAutomationPage: Page = () => {
  const switchers = useGetSwitcherEmailsQuery()

  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [selectedStatus, setSelectedStatus] =
    useState<SwitcherEmailStatus | null>(null)

  const [activateContract, { loading: activateContractLoading }] =
    useActivatePendingAgreementMutation()

  const [terminateContract, { loading: terminateContractLoading }] =
    useTerminateContractMutation()

  useTitle('Tools | Switcher Automation')

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
            <TableBody>
              {switchers.data?.switchableSwitcherEmails
                ?.filter((email) => {
                  if (!email.switcherType) {
                    return true
                  }
                  if (
                    !SwitcherTypeMarket[email.switcherType as SwitcherTypes]
                  ) {
                    return true
                  }
                  const status = getSwitcherEmailStatus(email)
                  return (
                    (!selectedMarket ||
                      SwitcherTypeMarket[
                        email.switcherType as SwitcherTypes
                      ] === selectedMarket) &&
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
                    loading={
                      activateContractLoading || terminateContractLoading
                    }
                    onActivate={async (contract, activeFrom) => {
                      await toast.promise(
                        activateContract({
                          variables: {
                            contractId: contract.id,
                            request: {
                              pendingAgreementId: contract.currentAgreementId,
                              fromDate: activeFrom,
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
                              terminationDate,
                              terminationReason,
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
            </TableBody>
          </Table>
        </>
      )}
    </>
  )
}

export default SwitcherAutomationPage
