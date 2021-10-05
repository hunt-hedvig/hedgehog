import styled from '@emotion/styled'
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
import { differenceInDays, format, subDays } from 'date-fns'
import {
  changeFromDateOptions,
  useChangeFromDate,
} from 'graphql/use-change-from-date-for-agreement'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Contract, GenericAgreement } from 'types/generated/graphql'

const initialFromDate = (agreement: GenericAgreement): Date =>
  agreement.fromDate ? new Date(agreement.fromDate) : new Date()

const getPreviousAgreement = (agreements, selectedAgreement) =>
  agreements.reduce((previousAgreement, current) => {
    if (
      current.toDate < selectedAgreement.fromDate &&
      (!previousAgreement || current.toDate > previousAgreement.toDate)
    ) {
      return current
    }
    return previousAgreement
  }, null)

const DialogWarning = styled.span`
  margin-top: 1rem;
  display: block;
  color: ${({ theme }) => theme.danger};
`

const DateSpan = styled.span`
  font-weight: bold;
  white-space: nowrap;
`

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

  const onConfirm = () => {
    const formattedFromDate = format(fromDate, 'yyyy-MM-dd')
    let confirmText = (
      <>
        Do you wish to change from date to{' '}
        <DateSpan>{formattedFromDate}</DateSpan>?
      </>
    )
    const previousAgreement = getPreviousAgreement(
      contract.genericAgreements,
      agreement,
    )
    if (previousAgreement) {
      const daysBetweenAgreements = differenceInDays(
        new Date(agreement.fromDate),
        new Date(previousAgreement.toDate),
      )
      if (daysBetweenAgreements <= 1) {
        const formattedPreviousToDate = format(
          subDays(fromDate, 1),
          'yyyy-MM-dd',
        )
        confirmText = (
          <>
            {confirmText}
            <DialogWarning>
              This will also change the to date of previous agreement to{' '}
              <DateSpan>{formattedPreviousToDate}</DateSpan>
            </DialogWarning>
          </>
        )
      }
    }
    confirm(confirmText).then(() => {
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
    })
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
