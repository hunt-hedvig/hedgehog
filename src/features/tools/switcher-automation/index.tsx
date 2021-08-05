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
import { Table } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { Market, SwitcherEmailStatus, SwitcherTypeMarket } from 'types/enums'
import { withShowNotification } from 'utils/notifications'
import { sleep } from 'utils/sleep'
import { getSwitcherEmailStatus } from 'utils/switcher-emails'
import { convertEnumToTitle, getFlagFromMarket } from 'utils/text'
import { StatusTableRow, SwitcherEmailRow } from './SwitcherTableRow'

export const SwitcherAutomationComponent: React.FC<{} & WithShowNotification> = ({
  showNotification,
}) => {
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
                    onActivate={(contract, activeFrom) => {
                      activateContract({
                        variables: {
                          contractId: contract.id,
                          request: {
                            pendingAgreementId: contract.currentAgreementId,
                            fromDate: format(activeFrom, 'yyyy-MM-dd'),
                          },
                        },
                      })
                        .then(async () => {
                          await sleep(1000)
                          showNotification({
                            type: 'olive',
                            header: 'Contract activated',
                            message: 'Successfully activated the contract.',
                          })
                        })
                        .catch((error) => {
                          showNotification({
                            type: 'red',
                            header: 'Unable to activate the contract',
                            message: error.message,
                          })
                          throw error
                        })
                    }}
                    onTerminate={(
                      contract,
                      terminationDate,
                      terminationReason,
                      comment,
                    ) => {
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
                      })
                        .then(async () => {
                          await sleep(1000)
                          switchers.refetch().then(() => {
                            showNotification({
                              type: 'olive',
                              header: 'Contract terminated',
                              message: 'Successfully terminated the contract.',
                            })
                          })
                        })
                        .catch((error) => {
                          showNotification({
                            type: 'red',
                            header: 'Unable to terminate',
                            message: error.message,
                          })
                          throw error
                        })
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

export const SwitcherAutomation = withShowNotification(
  SwitcherAutomationComponent,
)
