import { Contract } from 'api/generated/graphql'
import { format } from 'date-fns'
import {
  activateContractOptions,
  useActivateContract,
} from 'graphql/use-activate-contract'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { FourthLevelHeadline, Paragraph } from 'hedvig-ui/typography'
import * as React from 'react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'

const MasterInceptionComponent: React.FunctionComponent<{
  contract: Contract
} & WithShowNotification> = ({ contract, showNotification }) => {
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
      {!datePickerEnabled && !contract.isTerminated && (
        <Button
          halfWidth
          variation={'success'}
          onClick={() => setDatePickerEnabled(true)}
        >
          Activate
        </Button>
      )}
      {!datePickerEnabled && contract.isTerminated && (
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
                  activateContract(
                    activateContractOptions(contract, activeFrom),
                  )
                    .then(() => {
                      showNotification({
                        type: 'olive',
                        header: 'Contract activated',
                        message: 'Successfully activated the contract.',
                      })
                      reset()
                    })
                    .catch((error) => {
                      showNotification({
                        type: 'red',
                        header: 'Unable to activate the contract',
                        message: error.message,
                      })
                      throw error
                    })
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

export const MasterInception = withShowNotification(MasterInceptionComponent)
