import { FourthLevelHeadline, MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'

const AccountEntriesInfoWrapper = styled('div')`
  margin-top: 4rem;
`

export const AccountEntriesInfo: React.FC = () => {
  return (
    <AccountEntriesInfoWrapper>
      <MainHeadline>Account Entries</MainHeadline>
      <FourthLevelHeadline>
        The total amount from the account entries, called the <i>balance</i>, at
        the end of a month, is the amount we will charge a member that month.
      </FourthLevelHeadline>
    </AccountEntriesInfoWrapper>
  )
}
