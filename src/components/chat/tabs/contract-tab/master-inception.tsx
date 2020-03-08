import { Contract } from 'api/generated/graphql'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { FourthLevelHeadline, Paragraph } from 'hedvig-ui/typography'
import {
  activateContractOptions,
  useActivateContract,
} from 'hooks/use-activate-contract'
import moment from 'moment'
import * as React from 'react'

export const MasterInception: React.FunctionComponent<{
  contract: Contract
}> = ({ contract }) => {
  if (!contract.hasPendingAgreement) {
    return <FourthLevelHeadline>{contract.masterInception}</FourthLevelHeadline>
  }

  const [activeFrom, setActiveFrom] = React.useState(moment())
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const reset = () => {
    setActiveFrom(moment())
    setDatePickerEnabled(false)
  }
  const activateContract = useActivateContract(contract)

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
              onClick={() =>
                activateContract(
                  activateContractOptions(contract, activeFrom),
                ).then(reset)
              }
              variation={'success'}
            >
              Activate
            </Button>
            <Button onClick={() => reset()}>Cancel</Button>
          </ButtonsGroup>
        </>
      )}
    </>
  )
}
