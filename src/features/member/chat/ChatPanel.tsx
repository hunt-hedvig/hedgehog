import styled from '@emotion/styled'
import { Button, Checkbox, FadeIn, Flex, Shadowed, Spinner } from '@hedvig-ui'
import { useDraftMessage } from 'features/member/messages/hooks/use-draft-message'
import { getSendMessageOptions, useSendMessage } from 'graphql/use-send-message'
import React, { useState } from 'react'
import { ChevronRight } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'
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
  position: relative;
  margin: 0 1rem;
  width: 100%;
`
const OptionsContainer = styled.div`
  margin: 0.5em 1em;

  height: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Tip = styled.span`
  margin-top: 0.2em;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const ChatTextArea = styled(({ error, ...props }) => (
  <TextareaAutosize {...props} />
))<{
  error?: boolean
}>`
  margin: 0;
  padding: 0.78571429em 1em;
  border-radius: 0.28571429rem;
  font-size: 14px;
  line-height: 1.2857;

  width: 100% !important;
  max-height: 500px;
  min-height: 150px;
  outline: none;
  resize: none;

  background: ${({ theme }) => theme.background};
  border: 1px solid
    ${({ error, theme }) => (!error ? theme.border : theme.danger)};

  &::placeholder {
    color: ${({ theme }) => theme.placeholderColor};
  }

  &:focus {
    &::placeholder {
      color: ${({ theme }) => theme.semiStrongForeground};
    }
  }
`

const SubmitButton = styled(Button)`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`

const ChatTip = styled.div`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};

  @media (max-width: 768px) {
    display: none;
  }
`

export const ChatPanel = ({ memberId }) => {
  const [draft, setDraft] = useDraftMessage({ memberId })
  const [error, setError] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(draft)
  const [forceSendMessage, setForceSendMessage] = useState(false)
  const [sendMessage, { loading }] = useSendMessage()
  const [textFieldFocused, setTextFieldFocused] = useState(false)

  const handleInputChange = (e: any) => {
    const value = e.target.value

    if (shouldIgnoreInput(value)) {
      return
    }
    if (loading) {
      return
    }
    setCurrentMessage(value)
    setDraft(value)
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
    setDraft('')

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
          error={error}
          value={currentMessage}
          onChange={handleInputChange}
          placeholder="Your message goes here..."
          onFocus={() => setTextFieldFocused(true)}
          onBlur={() => setTextFieldFocused(false)}
          onKeyDown={(e) => {
            if (e.metaKey && e.keyCode === Keys.Enter.code && currentMessage) {
              handleSubmit()
            }
          }}
        />
      </ChatForm>
      <OptionsContainer>
        <Checkbox
          label="Force message"
          color="primary"
          checked={forceSendMessage}
          onChange={() =>
            setForceSendMessage((prevForceSendMessage) => !prevForceSendMessage)
          }
        />

        {textFieldFocused && !loading && (
          <FadeIn duration={200}>
            <ChatTip>
              Press <Shadowed>Command</Shadowed> + <Shadowed>Enter</Shadowed> to
              send
            </ChatTip>
          </FadeIn>
        )}

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

        {loading && <Spinner />}
      </OptionsContainer>
    </MessagesPanelContainer>
  )
}
