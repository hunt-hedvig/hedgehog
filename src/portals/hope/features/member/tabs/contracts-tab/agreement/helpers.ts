import styled from '@emotion/styled'
import { differenceInDays, parseISO } from 'date-fns'
import formatDate from 'date-fns/format'

export const DialogWarning = styled.span`
  margin-top: 1rem;
  display: block;
  color: ${({ theme }) => theme.danger};
`

export const DateSpan = styled.span`
  font-weight: bold;
  white-space: nowrap;
`

export const checkGapBetweenAgreements = (previousAgreement, nextAgreement) =>
  differenceInDays(
    new Date(nextAgreement.fromDate),
    new Date(previousAgreement.toDate),
  ) <= 1

export const getTodayFormatDate = () => {
  const isoDate = parseISO(new Date().toISOString())
  return formatDate(isoDate, 'yyyy-MM-dd')
}
