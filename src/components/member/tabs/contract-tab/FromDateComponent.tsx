import { Agreement, Contract } from 'api/generated/graphql'
import { format } from 'date-fns'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import * as React from 'react'
import { Card } from '../../../../../shared/hedvig-ui/card'
import {
  changeFromDateOptions,
  useChangeFromDate,
} from '../../../../graphql/use-change-from-date-for-agreement'
import { WithShowNotification } from '../../../../store/actions/notificationsActions'
import { ButtonSpacing } from './contract-item'

const initialFromDate = (agreement: Agreement): Date =>
  agreement.fromDate ? new Date(agreement.fromDate) : new Date()

const FromDateComponent: React.FunctionComponent<{
  agreement: Agreement
  contract: Contract
  showNotifaction: (data: WithShowNotification) => void
}> = ({ agreement, contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [fromDate, setFromDate] = React.useState(initialFromDate(agreement))
  const [
    changeFromDate,
    { loading: changeFromDateLoading },
  ] = useChangeFromDate(contract)
  const reset = () => {
    setFromDate(initialFromDate(agreement))
    setDatePickerEnabled(false)
  }

  return (
    <>
      <Card span={2}>
        <span>From Date</span>
        <span>
          {agreement.fromDate != null
            ? format(new Date(agreement.fromDate), 'yyyy-MM-dd')
            : 'Not set'}
        </span>
        <ButtonSpacing>
          {!datePickerEnabled && (
            <Button onClick={() => setDatePickerEnabled(true)}>Edit</Button>
          )}
          {datePickerEnabled && (
            <>
              <DateTimePicker date={fromDate} setDate={setFromDate} />
              <ButtonsGroup>
                <Button
                  fullWidth
                  onClick={() => {
                    changeFromDate(
                      changeFromDateOptions(agreement, fromDate),
                    ).then((response) => console.log(response))
                    reset()
                  }}
                >
                  Set from date
                </Button>
                <Button fullWidth onClick={() => reset()}>
                  Cancel
                </Button>
              </ButtonsGroup>
            </>
          )}
        </ButtonSpacing>
      </Card>
    </>
  )
}

export const FromDate = FromDateComponent
