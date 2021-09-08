import { Button, ButtonsGroup, DateTimePicker } from '@hedvig-ui'
import { Contract } from 'api/generated/graphql'
import { format } from 'date-fns'
import {
  activateContractOptions,
  useActivateContract,
} from 'graphql/use-activate-contract'
import { FourthLevelHeadline, Paragraph } from 'hedvig-ui/typography'
import React from 'react'
import { toast } from 'react-hot-toast'

export const MasterInception: React.FC<{
  contract: Contract
}> = ({ contract }) => {
  if (!contract.hasPendingAgreement) {
    return <FourthLevelHeadline>{contract.masterInception}</FourthLevelHeadline>
  }

  const [activeFrom, setActiveFrom] = React.useState(new Date())
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const reset = () => {
    setActiveFrom(new Date())
    setDatePickerEnabled(false)
  }
  const [
    activateContract,
    { loading: activateContractLoading },
  ] = useActivateContract(contract)

  return (
    <>
      {!datePickerEnabled && !contract.terminationDate && (
        <Button
          halfWidth
          variation={'success'}
          onClick={() => setDatePickerEnabled(true)}
        >
          Activate
        </Button>
      )}
      {!datePickerEnabled && contract.terminationDate && (
        <Paragraph>Terminated contract cannot be activated</Paragraph>
      )}
      {datePickerEnabled && (
        <>
          <DateTimePicker date={activeFrom} setDate={setActiveFrom} />
          <ButtonsGroup>
            <Button
              fullWidth
              disabled={activateContractLoading}
              onClick={() => {
                const confirmed = window.confirm(
                  `Are you sure you want to activate this contract with master inception of ${format(
                    activeFrom,
                    'yyyy-MM-dd',
                  )}?`,
                )
                if (confirmed) {
                  toast.promise(
                    activateContract(
                      activateContractOptions(contract, activeFrom),
                    ),
                    {
                      loading: 'Activating contract',
                      success: () => {
                        reset()
                        return 'Contract activated'
                      },
                      error: 'Could not activate contract',
                    },
                  )
                }
              }}
              variation={'success'}
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
