import { Agreement, Contract } from 'api/generated/graphql'
import { format } from 'date-fns'
import {
  changeFromDateOptions,
  useChangeFromDate,
} from 'graphql/use-change-from-date-for-agreement'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { Spacing } from 'hedvig-ui/spacing'
import { FourthLevelHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import { Notification } from 'store/actions/notificationsActions'

const initialFromDate = (agreement: Agreement): Date =>
  agreement.fromDate ? new Date(agreement.fromDate) : new Date()

export const FromDate: React.FunctionComponent<{
  agreement: Agreement
  contract: Contract
  showNotification: (data: Notification) => void
}> = ({ agreement, contract, showNotification }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [fromDate, setFromDate] = React.useState(initialFromDate(agreement))
  const [changeFromDate] = useChangeFromDate(contract)
  const reset = () => {
    setFromDate(initialFromDate(agreement))
    setDatePickerEnabled(false)
  }
  React.useEffect(() => {
    reset()
  }, [agreement])

  return (
    <>
      <ThirdLevelHeadline>From Date</ThirdLevelHeadline>
      {!datePickerEnabled && (
        <>
          <Spacing bottom width={'auto'}>
            <FourthLevelHeadline>
              {agreement.fromDate != null
                ? format(new Date(agreement.fromDate), 'yyyy-MM-dd')
                : 'Not set'}
            </FourthLevelHeadline>
          </Spacing>
          <Button
            variation={'primary'}
            halfWidth
            onClick={() => setDatePickerEnabled(true)}
          >
            Change from date
          </Button>
        </>
      )}
      {datePickerEnabled && (
        <>
          <Spacing bottom width={'auto'}>
            <DateTimePicker date={fromDate} setDate={setFromDate} />
          </Spacing>
          <ButtonsGroup>
            <Button
              variation={'secondary'}
              fullWidth
              onClick={() => {
                const formattedFromDate = format(fromDate, 'yyyy-MM-dd')
                if (
                  !window.confirm(`Change from date to ${formattedFromDate}?`)
                ) {
                  return
                }
                changeFromDate(changeFromDateOptions(agreement, fromDate))
                  .then(() => {
                    showNotification({
                      type: 'olive',
                      header: 'Success',
                      message: `Successfully changed the from date to ${formattedFromDate}`,
                    })
                    reset()
                  })
                  .catch((error) => {
                    showNotification({
                      type: 'red',
                      header: 'Error',
                      message: error.message,
                    })
                    throw error
                  })
              }}
            >
              Change
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
