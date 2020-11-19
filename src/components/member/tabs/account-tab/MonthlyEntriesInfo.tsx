import { FourthLevelHeadline, MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'

const MonthlyEntriesInfoWrapper = styled('div')`
  margin-top: 4rem;
`

export const MonthlyEntriesInfo: React.FC = () => {
  return (
    <MonthlyEntriesInfoWrapper>
      <MainHeadline>Monthly Entries</MainHeadline>
      <FourthLevelHeadline>
        Entries that will be added once <strong>every month</strong>
      </FourthLevelHeadline>
    </MonthlyEntriesInfoWrapper>
  )
}
