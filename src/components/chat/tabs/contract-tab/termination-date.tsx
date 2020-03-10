import { Contract, TerminationReason } from 'api/generated/graphql'
import { format } from 'date-fns'
import {
  changeTerminationDateOptions,
  useChangeTerminationDate,
} from 'graphql/use-change-termination-date'
import {
  revertTerminationOptions,
  useRevertTermination,
} from 'graphql/use-revert-termination'
import {
  terminateContractOptions,
  useTerminateContract,
} from 'graphql/use-terminate-contract'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { EnumDropdown } from 'hedvig-ui/dropdown'
import { TextArea } from 'hedvig-ui/text-area'
import { FourthLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'

const initialTerminationDate = (contract: Contract): Date =>
  contract.isTerminated ? new Date(contract.terminationDate) : new Date()

export const TerminationDate: React.FunctionComponent<{
  contract: Contract
}> = ({ contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [terminationDate, setTerminationDate] = React.useState(
    initialTerminationDate(contract),
  )
  const [terminationReason, setTerminationReason] = React.useState(null)
  const [comment, setComment] = React.useState('')
  const reset = () => {
    setTerminationDate(initialTerminationDate(contract))
    setTerminationReason(null)
    setDatePickerEnabled(false)
  }
  const [
    terminateContract,
    { loading: terminateContractLoading },
  ] = useTerminateContract(contract)
  const [
    changeTerminationDate,
    { loading: changeTerminationDateLoading },
  ] = useChangeTerminationDate(contract)
  const [
    revertTermination,
    { loading: revertTerminationLoading },
  ] = useRevertTermination(contract)

  if (contract.isTerminated) {
    return (
      <>
        {!datePickerEnabled && (
          <>
            <FourthLevelHeadline>
              {contract.terminationDate}
            </FourthLevelHeadline>
            <ButtonsGroup>
              <Button
                fullWidth
                variation={'secondary'}
                onClick={() => setDatePickerEnabled(true)}
              >
                Change termination date
              </Button>
              <Button
                fullWidth
                variation={'success'}
                disabled={revertTerminationLoading}
                onClick={() => {
                  if (
                    window.confirm('Are you want to revert the termination?')
                  ) {
                    revertTermination(
                      revertTerminationOptions(contract),
                    ).then(() => reset())
                  }
                }}
              >
                Revert termination
              </Button>
            </ButtonsGroup>
          </>
        )}
        {datePickerEnabled && (
          <>
            <DateTimePicker
              date={terminationDate}
              setDate={setTerminationDate}
            />
            <ButtonsGroup>
              <Button
                fullWidth
                variation={'primary'}
                disabled={changeTerminationDateLoading}
                onClick={() => {
                  const confirmed = window.confirm(
                    `Are you sure you want to change the termination date from ${
                      contract.terminationDate
                    } to ${format(terminationDate, 'yyyy-MM-dd')}?`,
                  )
                  if (confirmed) {
                    changeTerminationDate(
                      changeTerminationDateOptions(contract, terminationDate),
                    ).then(reset)
                  }
                }}
              >
                Change
              </Button>
              <Button fullWidth onClick={() => reset()}>
                Cancel
              </Button>
            </ButtonsGroup>
          </>
        )}
      </>
    )
  }
  return (
    <>
      {!datePickerEnabled && (
        <Button variation={'danger'} onClick={() => setDatePickerEnabled(true)}>
          Terminate contract
        </Button>
      )}
      {datePickerEnabled && (
        <>
          <DateTimePicker date={terminationDate} setDate={setTerminationDate} />
          <EnumDropdown
            enumToSelectFrom={TerminationReason}
            placeholder={'Termination reason'}
            setValue={setTerminationReason}
          />
          <TextArea
            placeholder={'Comment on the reason of termination...'}
            setText={setComment}
          />
          <ButtonsGroup>
            <Button
              fullWidth
              variation={'danger'}
              disabled={terminationReason === null || terminateContractLoading}
              onClick={() => {
                const confirmed = window.confirm(
                  `Are you sure you want to termination this contract with the termination date ${format(
                    terminationDate,
                    'yyyy-MM-dd',
                  )}?`,
                )
                if (confirmed) {
                  terminateContract(
                    terminateContractOptions(
                      contract,
                      terminationDate,
                      terminationReason!,
                      comment,
                    ),
                  ).then(reset)
                }
              }}
            >
              Terminate
            </Button>
            <Button fullWidth onClick={() => reset()}>
              Cancel
            </Button>
          </ButtonsGroup>
        </>
      )}
    </>
  )
}
