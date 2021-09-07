import styled from '@emotion/styled'
import formatDate from 'date-fns/format'
import React from 'react'

const TableColumnSubtext = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const FlexVertically = styled.div`
  display: flex;
  flex-direction: column;
`

export const DateTimeTableCell: React.FC<{ date: Date }> = ({ date }) => {
  const dateString = formatDate(date, 'dd MMMM, yyyy')
  const timeString = formatDate(date, 'HH:mm')
  return (
    <FlexVertically>
      {dateString}
      <TableColumnSubtext>{timeString}</TableColumnSubtext>
    </FlexVertically>
  )
}
