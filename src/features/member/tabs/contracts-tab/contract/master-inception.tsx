import {
  Button,
  ButtonsGroup,
  FourthLevelHeadline,
  Paragraph,
  TextDatePicker,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  Contract,
  useActivatePendingAgreementMutation,
} from 'types/generated/graphql'
import { getTodayFormatDate } from 'features/member/tabs/contracts-tab/agreement/helpers'

export const MasterInception: React.FC<{
  contract: Contract
}> = ({ contract }) => {
  if (!contract.hasPendingAgreement) {
    return <FourthLevelHeadline>{contract.masterInception}</FourthLevelHeadline>
  }

  const [activeFrom, setActiveFrom] = React.useState<string | null>(
    getTodayFormatDate(),
  )
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)

  const reset = () => {
    setActiveFrom(getTodayFormatDate())
    setDatePickerEnabled(false)
  }

  const [activateContract, { loading: activateContractLoading }] =
    useActivatePendingAgreementMutation()

  const { confirm } = useConfirmDialog()

  return (
    <>
      {!datePickerEnabled && !contract.terminationDate && (
        <Button status="success" onClick={() => setDatePickerEnabled(true)}>
          Activate
        </Button>
      )}
      {!datePickerEnabled && contract.terminationDate && (
        <Paragraph>Terminated contract cannot be activated</Paragraph>
      )}
      {datePickerEnabled && (
        <>
          <TextDatePicker
            onChange={(date) => date && setActiveFrom(date)}
            value={activeFrom}
          />
          <ButtonsGroup>
            <Button
              disabled={activateContractLoading}
              onClick={() => {
                const confirmMessage = `Are you sure you want to activate this contract with master inception of ${activeFrom}?`

                confirm(confirmMessage).then(() => {
                  toast.promise(
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
                      success: () => {
                        reset()
                        return 'Contract activated'
                      },
                      error: 'Could not activate contract',
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
