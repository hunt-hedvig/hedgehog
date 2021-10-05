import styled from '@emotion/styled'
import { differenceInDays, format } from 'date-fns'

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

export const formatDate = (date) => format(date, 'yyyy-MM-dd')
