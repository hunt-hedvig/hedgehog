import { Agreement, Contract } from 'api/generated/graphql'
import { format } from 'date-fns'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import * as React from 'react'
import { Card } from '../../../../../shared/hedvig-ui/card'
import { Spacing } from '../../../../../shared/hedvig-ui/spacing'
import {
  changeToDateOptions,
  useChangeToDate,
} from '../../../../graphql/use-change-to-date-for-agreement'
import { ButtonSpacing } from './contract-item'

const initialToDate = (agreement: Agreement): Date =>
  agreement.toDate ? new Date(agreement.toDate) : new Date()

const ToDateComponent: React.FunctionComponent<{
  agreement: Agreement
  contract: Contract
}> = ({ agreement, contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [toDate, setToDate] = React.useState(initialToDate(agreement))
  const [changeToDate, { loading: changeToDateLoading }] = useChangeToDate(
    contract,
  )
  const reset = () => {
    setToDate(initialToDate(agreement))
    setDatePickerEnabled(false)
  }

  return (
    <>
      <Card span={2}>
        To Date
        {/*<Spacing all>*/}
        <span>
          {agreement.toDate != null
            ? format(new Date(agreement.toDate), 'yyyy-MM-dd')
            : 'Not yet set'}
        </span>
        {/*</Spacing>*/}
        <ButtonSpacing>
          {!datePickerEnabled && (
            <Button onClick={() => setDatePickerEnabled(true)}>Edit</Button>
          )}
          {datePickerEnabled && (
            <>
              <DateTimePicker date={toDate} setDate={setToDate} />
              <ButtonsGroup>
                <Button
                  fullWidth
                  onClick={() => {
                    changeToDate(
                      changeToDateOptions(agreement, toDate),
                    ).then((response) => console.log(response))
                    reset()
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
        </ButtonSpacing>
      </Card>
    </>
  )
}

export const ToDate = ToDateComponent
