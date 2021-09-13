import styled from '@emotion/styled'
import { Button, Checkbox, TextArea } from '@hedvig-ui'
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

const ChatTextArea = styled(TextArea)<{ error?: boolean }>`
  overflow-y: scroll;
  max-height: 150px;
`

export const ChatPanel = ({ memberId }) => {
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
  }

  const handleSubmit = () => {
    if (loading) {
      return
    }
    toast.promise(
      sendMessage(
        getSendMessageOptions(memberId, currentMessage, forceSendMessage),
      ),
      {
        loading: 'Sending message',
        success: () => {
          setCurrentMessage('')
          setForceSendMessage(false)
          return 'Message sent'
        },
        error: 'Could not send message',
      },
    )
  }

  // @ts-ignore
  return (
    <MessagesPanelContainer>
      <ChatForm onSubmit={handleSubmit}>
        <ChatTextArea
          autoFocus
          rows={5}
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
          placeholder={'Your message goes here...'}
        />
      </ChatForm>

      <OptionsContainer>
        <div style={{ marginLeft: '2.0em' }}>
          <Checkbox
            label={'Force message'}
            color="primary"
            checked={forceSendMessage}
            onChange={(e) => setForceSendMessage(e.currentTarget.checked)}
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
