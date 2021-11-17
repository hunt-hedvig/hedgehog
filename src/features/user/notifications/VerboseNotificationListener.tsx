import styled from '@emotion/styled'
import { Button, FadeIn, Flex } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import chroma from 'chroma-js'
import { useMe } from 'features/user/hooks/use-me'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'

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
`

const VerboseNotification: React.FC<{ toastId: string; path: string }> = ({
  toastId,
  path,
}) => {
  return (
    <FadeIn duration={200} translateTo="translateY(20%)">
      <Wrapper>
        <Flex direction="column" align="center" justify="center">
          <div>
            <UserCircle>CP</UserCircle>
          </div>
          <Message>Carl wants to share a page with you</Message>
          <Flex justify="center" style={{ marginTop: '2rem' }}>
            <Button
              onClick={() => toast.remove(toastId)}
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
              onClick={() => window.open(path)}
            >
              Open
            </Button>
          </Flex>
        </Flex>
      </Wrapper>
    </FadeIn>
  )
}

export const VerboseNotificationListener: React.FC = () => {
  const { me } = useMe()

  useKeyIsPressed(Keys.Space, () => {
    toast.custom(
      (t) => <VerboseNotification toastId={t.id} path={'/dashborad'} />,
      {
        duration: 5000,
      },
    )
  })

  useEffect(() => {
    console.log('New notification')
  }, [me.notifications])

  return null
}
