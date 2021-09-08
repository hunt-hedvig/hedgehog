import { Button, ButtonsGroup, DateTimePicker, Spacing } from '@hedvig-ui'
import { Contract, GenericAgreement } from 'api/generated/graphql'
import { format } from 'date-fns'
import {
  changeToDateOptions,
  useChangeToDate,
} from 'graphql/use-change-to-date-for-agreement'
import {
  FourthLevelHeadline,
  Paragraph,
  ThirdLevelHeadline,
} from 'hedvig-ui/typography'
import React from 'react'
import { toast } from 'react-hot-toast'

const initialToDate = (agreement: GenericAgreement): Date =>
  agreement.toDate ? new Date(agreement.toDate) : new Date()

export const ToDate: React.FC<{
  agreement: GenericAgreement
  contract: Contract
}> = ({ agreement, contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [toDate, setToDate] = React.useState(initialToDate(agreement))
  const [changeToDate] = useChangeToDate(contract)
  const reset = () => {
    setToDate(initialToDate(agreement))
    setDatePickerEnabled(false)
  }
  React.useEffect(() => {
    reset()
  }, [agreement])

  return (
    <>
      <ThirdLevelHeadline>To Date</ThirdLevelHeadline>
      {!datePickerEnabled && (
        <Spacing bottom width={'auto'}>
          <FourthLevelHeadline>
            {agreement.toDate !== null
              ? format(new Date(agreement.toDate), 'yyyy-MM-dd')
              : 'Active'}
          </FourthLevelHeadline>
        </Spacing>
      )}
      {!datePickerEnabled && agreement.toDate && !contract.terminationDate && (
        <Button variation="primary" onClick={() => setDatePickerEnabled(true)}>
          Edit
        </Button>
      )}
      {!datePickerEnabled && contract.terminationDate && (
        <Paragraph>Terminated</Paragraph>
      )}
      {datePickerEnabled && (
        <>
          <Spacing bottom width={'auto'}>
            <DateTimePicker date={toDate} setDate={setToDate} />
          </Spacing>
          <ButtonsGroup>
            <Button
              variation="secondary"
              onClick={() => {
                const formattedToDate = format(toDate, 'yyyy-MM-dd')
                if (
                  !window.confirm(`Change the to date to ${formattedToDate}?`)
                ) {
                  return
                }

                toast.promise(
                  changeToDate(changeToDateOptions(agreement, toDate)),
                  {
                    loading: 'Changing date',
                    success: () => {
                      reset()
                      return 'Date changed'
                    },
                    error: 'Could not change date',
                  },
                )
              }}
            >
              Confirm
            </Button>
            <Button onClick={() => reset()}>Cancel</Button>
          </ButtonsGroup>
        </>
      )}
    </>
  )
}
