import styled from '@emotion/styled'
import { Button, Capitalized, FadeIn, Flex } from '@hedvig-ui'
import React, { useEffect, useState } from 'react'
import { useGetMeQuery } from 'types/generated/graphql'

const Notification = styled.div`
  background-color: ${({ theme }) => theme.highlight};
  color: ${({ theme }) => theme.darkHighlight};
  padding: 1.1em;
  border-radius: 6px;
  max-width: 450px;
  margin-bottom: 2em;
  overflow: hidden;
`

const NotificationAcceptButton = styled(Button)`
  border: 1px solid ${({ theme }) => theme.darkHighlight};
  color: ${({ theme }) => theme.darkHighlight} !important;
  background-color: transparent;
`

const NotificationDismissButton = styled(Button)`
  color: ${({ theme }) => theme.darkHighlight} !important;
  background-color: transparent;
  border: none;
  :hover {
    background-color: transparent;
    color: ${({ theme }) => theme.background} !important;
  }
`

const CONVERSATIONS_STATUS_KEY = 'hedvig:conversations:status'

export const EnableConversationsNotification: React.FC<{}> = () => {
  const [show, setShow] = useState<null | string>(null)
  const { data } = useGetMeQuery()

  const me = data?.me

  useEffect(() => {
    const storedValue = localStorage.getItem(CONVERSATIONS_STATUS_KEY)
    setShow(storedValue)
  }, [])

  if (!me) {
    return null
  }

  if (show === 'disabled') {
    return (
      <FadeIn delay={'1000ms'} duration={500}>
        <Notification onClick={() => setShow('enabled')}>
          Changed your mind?
        </Notification>
      </FadeIn>
    )
  }

  return (
    <FadeIn delay={'1000ms'} duration={500}>
      <Notification>
        <div>
          <span style={{ fontWeight: 'bold' }}>
            Hey{' '}
            <Capitalized>
              {me.email.split(/[^\w]/)[0].toLowerCase()}
            </Capitalized>
            !
          </span>
          <br />
          Would you like to try a new version of the questions tab? Don't worry,
          you can disable it anytime.
        </div>
        <Flex direction={'row'} style={{ marginTop: '1.0em' }}>
          <NotificationAcceptButton
            onClick={() => {
              localStorage.setItem(CONVERSATIONS_STATUS_KEY, 'enabled')
              setShow('enabled')
            }}
          >
            Yes please!
          </NotificationAcceptButton>
          <NotificationDismissButton
            style={{ marginLeft: '1.0em' }}
            onClick={() => {
              localStorage.setItem(CONVERSATIONS_STATUS_KEY, 'disabled')
              setShow('disabled')
            }}
          >
            Dismiss
          </NotificationDismissButton>
        </Flex>
      </Notification>
    </FadeIn>
  )
}
