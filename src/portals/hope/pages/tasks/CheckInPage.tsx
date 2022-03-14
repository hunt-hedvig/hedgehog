import { Page } from 'portals/hope/pages/routes'
import styled from '@emotion/styled'
import React from 'react'
import { Button, Paragraph, SecondLevelHeadline, Spacing } from '@hedvig-ui'
import chroma from 'chroma-js'

const MessageCard = styled.div`
  background-color: ${({ theme }) =>
    chroma(theme.backgroundTransparent).alpha(0.04).hex()};
  max-width: 40rem;
  padding: 2rem 2rem;
  border-radius: 0.3rem;

  p {
    color: ${({ theme }) => theme.semiStrongForeground};
  }
`

const CheckInPage: Page = () => {
  return (
    <MessageCard>
      <SecondLevelHeadline>
        Check in to start answering questions
      </SecondLevelHeadline>
      <Paragraph>
        By checking in, you will be assigned a portion of all incoming claims
        and questions. The portion you receive depends on how many others are
        currently checked-in.
      </Paragraph>
      <Spacing top="small" />
      <Button size="medium">Check in</Button>
    </MessageCard>
  )
}

export default CheckInPage
