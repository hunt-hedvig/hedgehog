import { Contract } from 'api/generated/graphql'
import {
  activateContractOptions,
  useActivateContract,
} from 'graphql/use-activate-contract'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { FourthLevelHeadline, Paragraph } from 'hedvig-ui/typography'
import * as React from 'react'

export const MasterInception: React.FunctionComponent<{
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
      {!datePickerEnabled && !contract.isTerminated && (
        <Button
          variation={'success'}
          onClick={() => setDatePickerEnabled(true)}
        >
          Activate contract
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
              onClick={() =>
                activateContract(
                  activateContractOptions(contract, activeFrom),
                ).then(reset)
              }
              variation={'success'}
            >
              Activate
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
