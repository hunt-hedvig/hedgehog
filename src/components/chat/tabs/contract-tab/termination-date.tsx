import { Contract, TerminationReason } from 'api/generated/graphql'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { EnumDropdown } from 'hedvig-ui/dropdown'
import { TextArea } from 'hedvig-ui/text-area'
import { FourthLevelHeadline } from 'hedvig-ui/typography'
import {
  changeTerminationDateOptions,
  useChangeTerminationDate,
} from 'hooks/use-change-termination-date'
import {
  revertTerminationOptions,
  useRevertTermination,
} from 'hooks/use-revert-termination'
import {
  terminateContractOptions,
  useTerminateContract,
} from 'hooks/use-terminate-contract'
import moment, { Moment } from 'moment'
import * as React from 'react'

const initialTerminationDate = (contract: Contract): Moment =>
  contract.isTerminated ? moment(contract.terminationDate) : moment()

export const TerminationDate: React.FunctionComponent<{
  contract: Contract
}> = ({ contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [terminationDate, setTerminationDate] = React.useState(
    initialTerminationDate(contract),
  )
  const [terminationReason, setTerminationReason] = React.useState(null)
  const [comment, setComment] = React.useState('')
  const [isReverting, setIsReverting] = React.useState(false)
  const reset = () => {
    setTerminationDate(initialTerminationDate(contract))
    setTerminationReason(null)
    setDatePickerEnabled(false)
    setIsReverting(false)
  }
  const [terminateContract, terminationLoading] = useTerminateContract(contract)
  const [
    changeTerminationDate,
    changeTerminationDateLoading,
  ] = useChangeTerminationDate(contract)
  const [revertTermination, revertTerminationLoading] = useRevertTermination(
    contract,
  )
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
                variation={'secondary'}
                onClick={() => setDatePickerEnabled(true)}
              >
                Change termination date
              </Button>
              {!isReverting && (
                <Button
                  variation={'success'}
                  onClick={() => setIsReverting(true)}
                >
                  Revert termination
                </Button>
              )}
              {isReverting && (
                <Button
                  variation={'default'}
                  disabled={revertTerminationLoading}
                  onClick={() =>
                    revertTermination(revertTerminationOptions(contract)).then(
                      reset,
                    )
                  }
                >
                  Are you sure?
                </Button>
              )}
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
                variation={'primary'}
                disabled={changeTerminationDateLoading}
                onClick={() =>
                  changeTerminationDate(
                    changeTerminationDateOptions(contract, terminationDate),
                  ).then(reset)
                }
              >
                Change
              </Button>
              <Button onClick={() => reset()}>Cancel</Button>
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
              variation={'danger'}
              disabled={terminationReason === null || terminationLoading}
              onClick={() =>
                terminateContract(
                  terminateContractOptions(
                    contract,
                    terminationDate,
                    terminationReason!,
                    comment,
                  ),
                ).then(reset)
              }
            >
              Terminate
            </Button>
            <Button onClick={() => reset()}>Cancel</Button>
          </ButtonsGroup>
        </>
      )}
    </>
  )
}
