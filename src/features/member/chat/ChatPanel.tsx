import styled from '@emotion/styled'
import { Button, Checkbox, Flex, TextArea } from '@hedvig-ui'
import { getSendMessageOptions, useSendMessage } from 'graphql/use-send-message'
import React, { useState } from 'react'
import { ChevronRight } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { Keys, shouldIgnoreInput } from 'utils/hooks/key-press-hook'

const MessagesPanelContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: wrap;
  margin-top: auto;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.backgroundLight};
  border-top: 0;
`

const ChatForm = styled.form`
  margin: 0 1rem;
  width: 100%;
`
const OptionsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SubmitButton = styled(Button)`
  margin: 1rem;
`

const Tip = styled.span`
  margin-top: 0.2em;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const ChatTextArea = styled(TextArea)<{ error?: boolean }>`
  overflow-y: scroll;
  max-height: 200px;

  background-color: ${({ error, theme }) =>
    error ? theme.lightDanger : 'default'} !important;
  border: 1px solid ${({ error, theme }) => (error ? theme.danger : 'default')} !important;
`

export const ChatPanel = ({ memberId }) => {
  const [error, setError] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [forceSendMessage, setForceSendMessage] = useState(false)
  const [sendMessage, { loading }] = useSendMessage()

  const shouldSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
    return e.metaKey && e.keyCode === Keys.Enter.code
  }

  const handleInputChange = (value: string) => {
    if (shouldIgnoreInput(value)) {
      return
    }
    if (loading) {
      return
    }
    setCurrentMessage(value)
    setError(false)
  }

  const handleSubmit = async () => {
    if (loading) {
      return
    }

    const { data } = await sendMessage(
      getSendMessageOptions(memberId, currentMessage, forceSendMessage),
    )

    if (
      data?.sendMessage.__typename === 'SendMessageFailed' &&
      !data.sendMessage.errorMessage.includes('notification')
    ) {
      toast.error('Could not send message')
      setError(true)
      return
    }

    setCurrentMessage('')
    setForceSendMessage(false)
    setError(false)

    if (
      data?.sendMessage.__typename === 'SendMessageFailed' &&
      data.sendMessage.errorMessage.includes('notification')
    ) {
      toast.success(
        <Flex direction="column" style={{ marginLeft: '1.0em' }}>
          <span>Message sent</span>
          <Tip>
            Please note that the member does not have notifications enabled
          </Tip>
        </Flex>,
        { duration: 4000 },
      )
    } else {
      toast.success('Message sent')
    }
  }

  // @ts-ignore
  return (
    <MessagesPanelContainer>
      <ChatForm onSubmit={handleSubmit}>
        <ChatTextArea
          autoFocus
          rows={7}
          error={error}
          value={currentMessage}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (shouldIgnoreInput(event.key)) {
              event.preventDefault()
              return
            }
            if (shouldSubmit(event)) {
              event.preventDefault()
              handleSubmit()
            }
          }}
          placeholder="Your message goes here..."
        />
      </ChatForm>
      <OptionsContainer>
        <div style={{ marginLeft: '2.0em' }}>
          <Checkbox
            label="Force message"
            color="primary"
            checked={forceSendMessage}
            onChange={() => setForceSendMessage(!forceSendMessage)}
          />
        </div>

        <SubmitButton
          disabled={currentMessage === ''}
          loading={loading}
          icon={<ChevronRight />}
          variation="primary"
          onClick={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          Send
        </SubmitButton>
      </OptionsContainer>
    </MessagesPanelContainer>
  )
}
