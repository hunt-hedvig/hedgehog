import {
  Button,
  ButtonsGroup,
  Dropdown,
  DropdownOption,
  FourthLevelHeadline,
  Spacing,
  TextArea,
  TextDatePicker,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/utils/modal-hook'
import { getTextFromEnumValue } from '@hedvig-ui/utils/text'
import { format } from 'date-fns'
import { TerminationReason } from 'features/config/constants'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  Contract,
  useChangeTerminationDateMutation,
  useRevertTerminationMutation,
  useTerminateContractMutation,
} from 'types/generated/graphql'

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
  ] = useTerminateContractMutation()
  const [
    changeTerminationDate,
    { loading: changeTerminationDateLoading },
  ] = useChangeTerminationDateMutation()
  const [
    revertTermination,
    { loading: revertTerminationLoading },
  ] = useRevertTerminationMutation()

  const { confirm } = useConfirmDialog()

  if (contract.terminationDate) {
    return (
      <>
        {!datePickerEnabled && (
          <>
            <Spacing bottom width="auto">
              <FourthLevelHeadline>
                {contract.terminationDate}
              </FourthLevelHeadline>
            </Spacing>
            <ButtonsGroup>
              <Button
                variant="secondary"
                onClick={() => setDatePickerEnabled(true)}
              >
                Change
              </Button>
              <Button
                status="success"
                disabled={revertTerminationLoading}
                onClick={() => {
                  confirm('Are you want to revert the termination?').then(
                    () => {
                      toast.promise(
                        revertTermination({
                          variables: {
                            contractId: contract.id,
                          },
                          optimisticResponse: {
                            revertTermination: {
                              __typename: 'Contract',
                              id: contract.id,
                              holderMemberId: contract.holderMemberId,
                              terminationDate: null,
                            },
                          },
                        }),
                        {
                          loading: 'Reverting termination',
                          success: () => {
                            return 'Termination reverted'
                          },
                          error: 'Could not revert termination',
                        },
                      )
                    },
                  )
                }}
              >
                Revert
              </Button>
            </ButtonsGroup>
          </>
        )}
        {datePickerEnabled && (
          <>
            <Spacing bottom width="auto">
              <TextDatePicker
                onChange={(date) => date && setTerminationDate(date)}
                value={terminationDate}
              />
            </Spacing>
            <ButtonsGroup>
              <Button
                disabled={changeTerminationDateLoading}
                onClick={() => {
                  const confirmMessage = `Are you sure you want to change the termination date from ${
                    contract.terminationDate
                  } to ${format(terminationDate, 'yyyy-MM-dd')}?`

                  confirm(confirmMessage).then(() => {
                    toast.promise(
                      changeTerminationDate({
                        variables: {
                          contractId: contract.id,
                        },
                        optimisticResponse: {
                          changeTerminationDate: {
                            __typename: 'Contract',
                            id: contract.id,
                            holderMemberId: contract.holderMemberId,
                            terminationDate,
                          },
                        },
                      }),
                      {
                        loading: 'Changing termination date',
                        success: () => {
                          reset()
                          return 'Termination date changed'
                        },
                        error: 'Could not change termination date',
                      },
                    )
                  })
                }}
              >
                Confirm
              </Button>
              <Button variant="tertiary" onClick={() => reset()}>
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
        <Button status="danger" onClick={() => setDatePickerEnabled(true)}>
          Terminate contract
        </Button>
      )}
      {datePickerEnabled && (
        <>
          <TextDatePicker
            onChange={(date) => date && setTerminationDate(date)}
            value={terminationDate}
          />
          <Spacing top="small" />
          <Dropdown placeholder="Reasons">
            {Object.keys(TerminationReason).map((key) => (
              <DropdownOption
                selected={terminationReason === TerminationReason[key]}
                onClick={() => setTerminationReason(TerminationReason[key])}
              >
                {getTextFromEnumValue(TerminationReason[key])}
              </DropdownOption>
            ))}
          </Dropdown>
          <Spacing top="small" />
          <TextArea
            placeholder="Comment on the reason of termination..."
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
          />
          <Spacing top="small" />
          <ButtonsGroup>
            <Button
              status="danger"
              disabled={terminationReason === null || terminateContractLoading}
              onClick={() => {
                const confirmedMsg = `Are you sure you want to terminate this contract with the termination date ${format(
                  terminationDate,
                  'yyyy-MM-dd',
                )}?`

                confirm(confirmedMsg).then(() => {
                  toast.promise(
                    terminateContract({
                      variables: {
                        contractId: contract.id,
                        request: {
                          terminationDate: format(
                            terminationDate,
                            'yyyy-MM-dd',
                          ),
                          terminationReason: terminationReason || '',
                          comment,
                        },
                      },
                      optimisticResponse: {
                        terminateContract: {
                          __typename: 'Contract',
                          id: contract.id,
                          holderMemberId: contract.holderMemberId,
                          terminationDate,
                        },
                      },
                    }),
                    {
                      loading: 'Terminating contract',
                      success: () => {
                        reset()
                        return 'Contract terminated'
                      },
                      error: 'Could not terminate contract',
                    },
                  )
                })
              }}
            >
              Terminate
            </Button>
            <Button variant="tertiary" onClick={() => reset()}>
              Cancel
            </Button>
          </ButtonsGroup>
        </>
      )}
    </>
  )
}
