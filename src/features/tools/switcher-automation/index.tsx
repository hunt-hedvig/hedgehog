import {
  Contract,
  Member,
  useActivatePendingAgreementMutation,
  useGetSwitcherEmailsQuery,
  useTerminateContractMutation,
} from 'api/generated/graphql'
import { format } from 'date-fns'
import { Checkbox } from 'hedvig-ui/checkbox'
import { MainHeadline, SecondLevelHeadline } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Table } from 'semantic-ui-react'
import { Market, SwitcherEmailStatus, SwitcherTypeMarket } from 'types/enums'
import { sleep } from 'utils/sleep'
import { getSwitcherEmailStatus } from 'utils/switcher-emails'
import { convertEnumToTitle, getFlagFromMarket } from 'utils/text'
import { StatusTableRow, SwitcherEmailRow } from './SwitcherTableRow'

export const SwitcherAutomation: React.FC = () => {
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
                  label={`${convertEnumToTitle(market)} ${getFlagFromMarket(
                    market,
                  )}`}
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
          <Table style={{ overflow: 'visible' }}>
            <Table.Header>
              <StatusTableRow>
                <Table.HeaderCell>Member</Table.HeaderCell>
                <Table.HeaderCell>Insurance</Table.HeaderCell>
                <Table.HeaderCell>Sign date</Table.HeaderCell>
                <Table.HeaderCell>Sent date</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Contract</Table.HeaderCell>
              </StatusTableRow>
            </Table.Header>
            <Table.Body>
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
            </Table.Body>
          </Table>
        </>
      )}
    </>
  )
}
