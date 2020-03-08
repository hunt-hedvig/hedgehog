import moment from 'moment'
import * as React from 'react'
import { Button, ButtonsGroup } from '../../../../../shared/hedvig-ui/button'
import { DateTimePicker } from '../../../../../shared/hedvig-ui/date-time-picker'
import {
  FourthLevelHeadline,
  Paragraph,
} from '../../../../../shared/hedvig-ui/typography'
import { Contract } from '../../../../api/generated/graphql'
import {
  activateContractOptions,
  useActivateContract,
} from '../../../../hooks/use-activate-contract'

export const MasterInception: React.FunctionComponent<{
  contract: Contract
}> = ({ contract }) => {
  if (!contract.hasPendingAgreement) {
    return <FourthLevelHeadline>{contract.masterInception}</FourthLevelHeadline>
  }

  const [activeFrom, setActiveFrom] = React.useState(moment())
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const activateContract = useActivateContract()

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
                activateContract(activateContractOptions(contract, activeFrom))
              }
              variation={'success'}
            >
              Activate
            </Button>
            <Button
              onClick={() => {
                setActiveFrom(moment())
                setDatePickerEnabled(false)
              }}
            >
              Cancel
            </Button>
          </ButtonsGroup>
        </>
      )}
    </>
  )
}
