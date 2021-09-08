import {
  Button,
  ButtonsGroup,
  DateTimePicker,
  EnumDropdown,
  Spacing,
} from '@hedvig-ui'
import { Contract } from 'api/generated/graphql'
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
import { TextArea } from 'hedvig-ui/text-area'
import { FourthLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { toast } from 'react-hot-toast'
import { TerminationReason } from 'types/enums'

const initialTerminationDate = (contract: Contract): Date =>
  contract.terminationDate ? new Date(contract.terminationDate) : new Date()

export const TerminationDate: React.FC<{
  contract: Contract
}> = ({ contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [terminationDate, setTerminationDate] = React.useState(
    initialTerminationDate(contract),
  )
  const [
    terminationReason,
    setTerminationReason,
  ] = React.useState<TerminationReason | null>(null)
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

  if (contract.terminationDate) {
    return (
      <>
        {!datePickerEnabled && (
          <>
            <Spacing bottom width={'auto'}>
              <FourthLevelHeadline>
                {contract.terminationDate}
              </FourthLevelHeadline>
            </Spacing>
            <ButtonsGroup>
              <Button
                fullWidth
                variation={'secondary'}
                onClick={() => setDatePickerEnabled(true)}
              >
                Change
              </Button>
              <Button
                fullWidth
                variation={'success'}
                disabled={revertTerminationLoading}
                onClick={() => {
                  if (
                    window.confirm('Are you want to revert the termination?')
                  ) {
                    toast.promise(
                      revertTermination(revertTerminationOptions(contract)),
                      {
                        loading: 'Reverting termination',
                        success: () => {
                          reset()
                          return 'Termination reverted'
                        },
                        error: 'Could not revert termination',
                      },
                    )
                  }
                }}
              >
                Revert
              </Button>
            </ButtonsGroup>
          </>
        )}
        {datePickerEnabled && (
          <>
            <Spacing bottom width={'auto'}>
              <DateTimePicker
                date={terminationDate}
                setDate={setTerminationDate}
              />
            </Spacing>
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
                    toast.promise(
                      changeTerminationDate(
                        changeTerminationDateOptions(contract, terminationDate),
                      ),
                      {
                        loading: 'Changing termination date',
                        success: () => {
                          reset()
                          return 'Termination date changed'
                        },
                        error: 'Could not change termination date',
                      },
                    )
                  }
                }}
              >
                Confirm
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
        <Button
          halfWidth
          variation={'danger'}
          onClick={() => setDatePickerEnabled(true)}
        >
          Terminate contract
        </Button>
      )}
      {datePickerEnabled && (
        <>
          <DateTimePicker date={terminationDate} setDate={setTerminationDate} />
          <EnumDropdown
            enumToSelectFrom={TerminationReason}
            placeholder={'Termination reason'}
            onChange={setTerminationReason}
          />
          <Spacing top bottom>
            <TextArea
              placeholder={'Comment on the reason of termination...'}
              value={comment}
              onChange={setComment}
            />
          </Spacing>
          <ButtonsGroup>
            <Button
              fullWidth
              variation={'danger'}
              disabled={terminationReason === null || terminateContractLoading}
              onClick={() => {
                const confirmed = window.confirm(
                  `Are you sure you want to terminate this contract with the termination date ${format(
                    terminationDate,
                    'yyyy-MM-dd',
                  )}?`,
                )
                if (confirmed) {
                  toast.promise(
                    terminateContract(
                      terminateContractOptions(
                        contract,
                        terminationDate,
                        terminationReason!,
                        comment,
                      ),
                    ),
                    {
                      loading: 'Terminating contract',
                      success: () => {
                        reset()
                        return 'Contract terminated'
                      },
                      error: 'Could not terminate contract',
                    },
                  )
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
