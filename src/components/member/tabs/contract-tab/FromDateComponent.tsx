import { Agreement } from 'api/generated/graphql'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import * as React from 'react'
import { Card } from '../../../../../shared/hedvig-ui/card'

const initialToDate = (agreement: Agreement): Date =>
  agreement.toDate ? new Date(agreement.toDate) : new Date()

const ToDateComponent: React.FunctionComponent<{ agreement: Agreement }> = ({
  agreement,
}) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [toDate, setToDate] = React.useState(initialToDate(agreement))
  const reset = () => {
    setToDate(initialToDate(agreement))
    setDatePickerEnabled(false)
  }

  return (
    <>
      <Card span={2}>
        To Date
        {!datePickerEnabled && (
          <Button
            variation={'danger'}
            onClick={() => setDatePickerEnabled(true)}
          >
            Edit
          </Button>
        )}
        {datePickerEnabled && (
          <>
            <DateTimePicker date={toDate} setDate={setToDate} />
            <ButtonsGroup>
              <Button
                fullWidth
                onClick={() => {
                  console.log('todo')
                }}
              >
                set to date
              </Button>
              <Button fullWidth onClick={() => reset()}>
                Cancel
              </Button>
            </ButtonsGroup>
          </>
        )}
      </Card>
    </>
  )
}

export const ToDate = ToDateComponent
