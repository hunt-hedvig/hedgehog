import styled from '@emotion/styled'
import { Button, FadeIn, Flex } from '@hedvig-ui'
import chroma from 'chroma-js'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useMarkNotificationAsReadMutation } from 'types/generated/graphql'

const UserCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 2.8rem;
  width: 2.8rem;
  border-radius: 50%;

  margin: 1rem;
  padding: 2rem;

  color: ${({ theme }) => theme.accentContrast};
  font-weight: bold;
  font-size: 1.2rem;

  background-color: ${({ theme }) =>
    chroma(theme.accent)
      .brighten(1)
      .hex()};
`

const Message = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
`

export const Wrapper = styled.div`
  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.16);
  width: 400px;
  border-radius: 6px;
  min-height: 100px;

  padding: 2rem;
  z-index: 100;
`

export const VerboseNotification: React.FC<{
  toastId: string
  notificationId: string
  path: string
  message: string
  signature: string
}> = ({ toastId, notificationId, path, message, signature }) => {
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation()

  const readNotification = () => {
    markNotificationAsRead({
      variables: { notificationId },
      optimisticResponse: {
        markNotificationAsRead: {
          __typename: 'UserNotification',
          id: notificationId,
          read: true,
        },
      },
    })
  }

  return (
    <FadeIn duration={400} translateTo="translateY(20%)">
      <Wrapper>
        <Flex direction="column" align="center" justify="center">
          <div>
            <UserCircle>{signature}</UserCircle>
          </div>
          <Message>{message}</Message>
          <Flex justify="center" style={{ marginTop: '2rem' }}>
            <Button
              onClick={() => {
                readNotification()
                toast.remove(toastId)
              }}
              style={{
                marginRight: '1rem',
                width: '100px',
                textAlign: 'center',
              }}
              variant="tertiary"
            >
              Dismiss
            </Button>
            <Button
              style={{
                marginLeft: '1rem',
                width: '100px',
                textAlign: 'center',
              }}
              onClick={() => {
                readNotification()
                toast.remove(toastId)
                window.open(path)
              }}
            >
              Open
            </Button>
          </Flex>
        </Flex>
      </Wrapper>
    </FadeIn>
  )
}
