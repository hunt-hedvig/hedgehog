import { Button, ButtonsGroup, DateTimePicker, Spacing } from '@hedvig-ui'
import { Contract, GenericAgreement } from 'api/generated/graphql'
import { format } from 'date-fns'
import {
  changeFromDateOptions,
  useChangeFromDate,
} from 'graphql/use-change-from-date-for-agreement'
import {
  FourthLevelHeadline,
  Paragraph,
  ThirdLevelHeadline,
} from 'hedvig-ui/typography'
import React from 'react'
import { toast } from 'react-hot-toast'

const initialFromDate = (agreement: GenericAgreement): Date =>
  agreement.fromDate ? new Date(agreement.fromDate) : new Date()

export const FromDate: React.FC<{
  agreement: GenericAgreement
  contract: Contract
}> = ({ agreement, contract }) => {
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
              {agreement.fromDate !== null
                ? format(new Date(agreement.fromDate), 'yyyy-MM-dd')
                : 'Not set'}
            </FourthLevelHeadline>
          </Spacing>
          {agreement.fromDate && !contract.terminationDate && (
            <Button
              variation="primary"
              onClick={() => setDatePickerEnabled(true)}
            >
              Edit
            </Button>
          )}
          {contract.terminationDate && <Paragraph>Terminated</Paragraph>}
        </>
      )}
      {datePickerEnabled && (
        <>
          <Spacing bottom width={'auto'}>
            <DateTimePicker date={fromDate} setDate={setFromDate} />
          </Spacing>
          <ButtonsGroup>
            <Button
              variation="secondary"
              onClick={() => {
                const formattedFromDate = format(fromDate, 'yyyy-MM-dd')
                if (
                  !window.confirm(`Change from date to ${formattedFromDate}?`)
                ) {
                  return
                }

                toast.promise(
                  changeFromDate(changeFromDateOptions(agreement, fromDate)),
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
