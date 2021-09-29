import {
  Button,
  ButtonsGroup,
  DateTimePicker,
  FourthLevelHeadline,
  Paragraph,
  Spacing,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/utils/modal-hook'
import { format } from 'date-fns'
import {
  changeFromDateOptions,
  useChangeFromDate,
} from 'graphql/use-change-from-date-for-agreement'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Contract, GenericAgreement } from 'types/generated/graphql'

const initialFromDate = (agreement: GenericAgreement): Date =>
  agreement.fromDate ? new Date(agreement.fromDate) : new Date()

export const FromDate: React.FC<{
  agreement: GenericAgreement
  contract: Contract
}> = ({ agreement, contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [fromDate, setFromDate] = React.useState(initialFromDate(agreement))
  const [changeFromDate] = useChangeFromDate(contract)
  const { confirm } = useConfirmDialog()

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
          <Spacing bottom width="auto">
            <FourthLevelHeadline>
              {agreement.fromDate !== null
                ? format(new Date(agreement.fromDate), 'yyyy-MM-dd')
                : 'Not set'}
            </FourthLevelHeadline>
          </Spacing>
          {agreement.fromDate && !contract.terminationDate && (
            <Button onClick={() => setDatePickerEnabled(true)}>Edit</Button>
          )}
          {contract.terminationDate && <Paragraph>Terminated</Paragraph>}
        </>
      )}
      {datePickerEnabled && (
        <>
          <Spacing bottom width="auto">
            <DateTimePicker date={fromDate} setDate={setFromDate} />
          </Spacing>
          <ButtonsGroup>
            <Button
              onClick={() => {
                const formattedFromDate = format(fromDate, 'yyyy-MM-dd')
                confirm(`Change from date to ${formattedFromDate}?`).then(
                  () => {
                    toast.promise(
                      changeFromDate(
                        changeFromDateOptions(agreement, fromDate),
                      ),
                      {
                        loading: 'Changing date',
                        success: () => {
                          reset()
                          return 'Date changed'
                        },
                        error: 'Could not change date',
                      },
                    )
                  },
                )
              }}
            >
              Confirm
            </Button>
            <Button variant="tertiary" onClick={() => reset()}>
              Cancel
            </Button>
          </ButtonsGroup>
        </>
      )}
    </>
  )
}
