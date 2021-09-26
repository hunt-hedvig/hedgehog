import {
  Button,
  ButtonsGroup,
  DateTimePicker,
  FourthLevelHeadline,
  Paragraph,
  Spacing,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { format } from 'date-fns'
import {
  changeToDateOptions,
  useChangeToDate,
} from 'graphql/use-change-to-date-for-agreement'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Contract, GenericAgreement } from 'types/generated/graphql'
import { useConfirmDialog } from 'utils/hooks/modal-hook'

const initialToDate = (agreement: GenericAgreement): Date =>
  agreement.toDate ? new Date(agreement.toDate) : new Date()

export const ToDate: React.FC<{
  agreement: GenericAgreement
  contract: Contract
}> = ({ agreement, contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [toDate, setToDate] = React.useState(initialToDate(agreement))
  const [changeToDate] = useChangeToDate(contract)
  const { confirm } = useConfirmDialog()

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
        <Spacing bottom width="auto">
          <FourthLevelHeadline>
            {agreement.toDate !== null
              ? format(new Date(agreement.toDate), 'yyyy-MM-dd')
              : 'Active'}
          </FourthLevelHeadline>
        </Spacing>
      )}
      {!datePickerEnabled && agreement.toDate && !contract.terminationDate && (
        <Button onClick={() => setDatePickerEnabled(true)}>Edit</Button>
      )}
      {!datePickerEnabled && contract.terminationDate && (
        <Paragraph>Terminated</Paragraph>
      )}
      {datePickerEnabled && (
        <>
          <Spacing bottom width="auto">
            <DateTimePicker date={toDate} setDate={setToDate} />
          </Spacing>
          <ButtonsGroup>
            <Button
              onClick={() => {
                const formattedToDate = format(toDate, 'yyyy-MM-dd')
                confirm(`Change the to date to ${formattedToDate}?`).then(
                  () => {
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
