import styled from '@emotion/styled'
import {
  Button,
  Checkbox,
  FadeIn,
  Flex,
  Shadowed,
  Spinner,
  TextArea,
} from '@hedvig-ui'
import {
  isPressing,
  Keys,
  shouldIgnoreInput,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { usePlatform } from '@hedvig-ui/hooks/use-platform'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetMessageHistoryDocument,
  useSendMessageMutation,
} from 'types/generated/graphql'
import { useDraft } from '@hedvig-ui/hooks/use-draft'

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

const ChatTextArea = styled(TextArea)<{ error?: boolean }>`
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

export const ChatPanel: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [currentMessage, setCurrentMessage] = useDraft(memberId)
  const [error, setError] = useState(false)
  const [forceSendMessage, setForceSendMessage] = useState(false)
  const [sendMessage, { loading }] = useSendMessageMutation()
  const [textFieldFocused, setTextFieldFocused] = useState(false)
  const { isMetaKey, metaKey } = usePlatform()

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

    const { data } = await sendMessage({
      variables: {
        input: {
          memberId,
          message: currentMessage,
          forceSendMessage,
        },
      },
      refetchQueries: () => [
        {
          query: GetMessageHistoryDocument,
          variables: {
            memberId,
          },
        },
      ],
      awaitRefetchQueries: true,
    })

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

  return (
    <MessagesPanelContainer>
      <ChatForm onSubmit={handleSubmit}>
        <ChatTextArea
          autoResize={true}
          maxHeight="350px"
          error={error}
          value={currentMessage}
          onChange={(e) => handleInputChange(e.currentTarget.value)}
          placeholder="Your message goes here..."
          onFocus={() => setTextFieldFocused(true)}
          onBlur={() => setTextFieldFocused(false)}
          onKeyDown={(e) => {
            if (isMetaKey(e) && isPressing(e, Keys.Enter) && currentMessage) {
              handleSubmit()
            }
          }}
        />
      </ChatForm>
      <OptionsContainer>
        <Checkbox
          label="Force message"
          checked={forceSendMessage}
          onChange={() =>
            setForceSendMessage((prevForceSendMessage) => !prevForceSendMessage)
          }
        />

        {textFieldFocused && !loading && (
          <FadeIn duration={200}>
            <ChatTip>
              Press <Shadowed>{metaKey.hint}</Shadowed> +{' '}
              <Shadowed>Enter</Shadowed> to send
            </ChatTip>
          </FadeIn>
        )}

        <SubmitButton
          disabled={currentMessage === '' || loading}
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
