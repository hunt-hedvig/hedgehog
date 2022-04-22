import { useHasPermission } from 'portals/hope/common/hooks/use-has-permission'
import { useCheckInOut } from 'portals/hope/features/tasks/hooks/use-check-in-out'
import { useMyMarkets } from 'portals/hope/common/hooks/use-my-markets'
import { UpdateUserMarketModal } from 'portals/hope/features/tasks/components/UpdateUserMarketModal'
import {
  Button,
  Flex,
  Keys,
  Paragraph,
  SecondLevelHeadline,
  Spacing,
  useKeyIsPressed,
} from '@hedvig-ui'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import styled from '@emotion/styled'
import chroma from 'chroma-js'

const MessageCard = styled.div`
  max-width: 45rem;
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

export const CheckInMessage: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const hasPermission = useHasPermission('questions')
  const { checkIn } = useCheckInOut()
  const { markets } = useMyMarkets()

  const isEnterPressed = useKeyIsPressed(Keys.Enter)
  const isCommandPressed = useKeyIsPressed(Keys.Command)

  const checkInHandler = () => {
    toast.success('You are now checked-in')
    checkIn()
  }

  useEffect(() => {
    if (isEnterPressed && isCommandPressed) {
      checkInHandler()
    }
  }, [isEnterPressed, isCommandPressed])

  return (
    <>
      <UpdateUserMarketModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={checkInHandler}
      />
      <MessageCard>
        <SecondLevelHeadline>
          Check in to start answering questions
        </SecondLevelHeadline>
        <Paragraph style={{ maxWidth: '25rem' }}>
          By checking in, you signal to other users in Hope that you are working
          with questions.
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

              checkInHandler()
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
    </>
  )
}
