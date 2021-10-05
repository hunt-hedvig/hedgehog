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
import { addDays } from 'date-fns'
import {
  changeToDateOptions,
  useChangeToDate,
} from 'graphql/use-change-to-date-for-agreement'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Contract, GenericAgreement } from 'types/generated/graphql'
import {
  checkGapBetweenAgreements,
  DateSpan,
  DialogWarning,
  formatDate,
} from './helpers'

const initialToDate = (agreement: GenericAgreement): Date =>
  agreement.toDate ? new Date(agreement.toDate) : new Date()

const getNextAgreement = (agreements, selectedAgreement) =>
  agreements.reduce((nextAgreement, current) => {
    if (
      selectedAgreement.toDate < current.fromDate &&
      (!nextAgreement || current.fromDate < nextAgreement.fromDate)
    ) {
      return current
    }
    return nextAgreement
  }, null)

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

  const onConfirm = () => {
    const formattedToDate = formatDate(toDate)
    let confirmText = (
      <>
        Do you wish to change the to date to{' '}
        <DateSpan>{formattedToDate}</DateSpan>?
      </>
    )
    const nextAgreement = getNextAgreement(
      contract.genericAgreements,
      agreement,
    )
    if (nextAgreement) {
      if (checkGapBetweenAgreements(agreement, nextAgreement)) {
        const formattedNextFromDate = formatDate(addDays(toDate, 1))
        confirmText = (
          <>
            {confirmText}
            <DialogWarning>
              This will also change the from date of next agreement to{' '}
              <DateSpan>{formattedNextFromDate}</DateSpan>
            </DialogWarning>
          </>
        )
      }
    }
    confirm(confirmText).then(() => {
      toast.promise(changeToDate(changeToDateOptions(agreement, toDate)), {
        loading: 'Changing date',
        success: () => {
          reset()
          return 'Date changed'
        },
        error: 'Could not change date',
      })
    })
  }

  return (
    <>
      <ThirdLevelHeadline>To Date</ThirdLevelHeadline>
      {!datePickerEnabled && (
        <Spacing bottom width="auto">
          <FourthLevelHeadline>
            {agreement.toDate !== null
              ? formatDate(new Date(agreement.toDate))
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
            <Button onClick={onConfirm}>Confirm</Button>
            <Button variant="tertiary" onClick={() => reset()}>
              Cancel
            </Button>
          </ButtonsGroup>
        </>
      )}
    </>
  )
}
