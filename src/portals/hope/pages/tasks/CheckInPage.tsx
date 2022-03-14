import { Page } from 'portals/hope/pages/routes'
import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import { Button, Paragraph, SecondLevelHeadline, Spacing } from '@hedvig-ui'
import chroma from 'chroma-js'
import { useHistory } from 'react-router'
import { useCheckInOut } from 'portals/hope/features/tasks/hooks/use-check-in-out'

const MessageCard = styled.div`
  background-color: ${({ theme }) =>
    chroma(theme.backgroundTransparent).alpha(0.03).hex()};
  max-width: 40rem;
  padding: 2rem 2rem;
  border-radius: 0.3rem;

  p {
    color: ${({ theme }) => theme.semiStrongForeground};
  }
`

const CheckInPage: Page = () => {
  const { checkedIn, checkIn, loading } = useCheckInOut()
  const history = useHistory()

  useEffect(() => {
    if (checkedIn) {
      history.push('/questions')
    }
  }, [checkedIn])

  if (loading || checkedIn) {
    return null
  }

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
      <Button size="medium" onClick={checkIn}>
        Check in
      </Button>
    </MessageCard>
  )
}

export default CheckInPage
