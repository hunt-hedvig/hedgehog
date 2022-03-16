import { Page } from 'portals/hope/pages/routes'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import {
  Button,
  FadeIn,
  Flex,
  Paragraph,
  SecondLevelHeadline,
  Spacing,
} from '@hedvig-ui'
import chroma from 'chroma-js'
import { useHistory } from 'react-router'
import { useCheckInOut } from 'portals/hope/features/tasks/hooks/use-check-in-out'
import { toast } from 'react-hot-toast'
import { useHasPermission } from 'portals/hope/common/hooks/use-has-permission'
import { UpdateUserMarketModal } from 'portals/hope/features/tasks/components/UpdateUserMarketModal'
import { useMyMarkets } from 'portals/hope/common/hooks/use-my-markets'

const MessageCard = styled.div`
  background-color: ${({ theme }) =>
    chroma(theme.backgroundTransparent).alpha(0.03).hex()};
  max-width: 45rem;
  padding: 2rem 2rem;
  border-radius: 0.3rem;

  p {
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .restricted-label {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};
    font-size: 0.8rem;
    max-width: 10rem;
    text-align: center;
    margin-left: 1.5rem;
  }
`

const CheckInPage: Page = () => {
  const [showModal, setShowModal] = useState(false)
  const hasPermission = useHasPermission('questions')
  const { checkedIn, checkIn, loading } = useCheckInOut()
  const { markets } = useMyMarkets()
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
    <>
      {showModal && (
        <UpdateUserMarketModal
          onClose={() => setShowModal(false)}
          onSubmit={() => {
            toast.success('You are now checked-in')
            checkIn()
          }}
        />
      )}
      <FadeIn>
        <MessageCard>
          <SecondLevelHeadline>
            Check in to start answering questions
          </SecondLevelHeadline>
          <Paragraph style={{ maxWidth: '25rem' }}>
            By checking in, you signal to other users in Hope that you are
            working with questions.
          </Paragraph>
          <Spacing top="small" />
          <Flex align="center">
            <Button
              size="medium"
              onClick={() => {
                if (markets.length === 0) {
                  setShowModal(true)
                  return
                }

                toast.success('You are now checked-in')
                checkIn()
              }}
              style={{ minWidth: '10rem' }}
              disabled={!hasPermission}
            >
              Check in
            </Button>
            {!hasPermission && (
              <div className="restricted-label">Only available for IEX</div>
            )}
          </Flex>
        </MessageCard>
      </FadeIn>
    </>
  )
}

export default CheckInPage
