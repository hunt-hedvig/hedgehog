import { SwitchableSwitcherEmail } from 'api/generated/graphql'
import { isPast, parseISO } from 'date-fns'
import { SwitcherEmailStatus } from 'types/enums'

export const getSwitcherEmailStatus = (
  switcherEmail: Pick<
    SwitchableSwitcherEmail,
    'cancellationDate' | 'note' | 'sentAt' | 'remindedAt'
  >,
): SwitcherEmailStatus => {
  if (
    switcherEmail.cancellationDate &&
    isPast(parseISO(switcherEmail.cancellationDate))
  ) {
    return SwitcherEmailStatus.PastCancellationDate
  }
  if (switcherEmail.note) {
    return SwitcherEmailStatus.InProgress
  }
  if (switcherEmail.remindedAt) {
    return SwitcherEmailStatus.Reminded
  }
  if (switcherEmail.sentAt) {
    return SwitcherEmailStatus.Sent
  }
  return SwitcherEmailStatus.Prepared
}
