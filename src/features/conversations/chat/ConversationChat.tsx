import styled from '@emotion/styled'
import { FadeIn, Flex, Paragraph, Shadowed, TextArea } from '@hedvig-ui'
import { Keys } from '@hedvig-ui/utils/key-press-hook'
import { useDraftMessage } from 'features/member/messages/hooks/use-draft-message'
import { MessagesList } from 'features/member/messages/MessagesList'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSendMessageMutation } from 'types/generated/graphql'

const ConversationContent = styled.div`
  background-color: ${({ theme }) => theme.accentBackground};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 70vh;
  border-radius: 8px;
`

const ConversationFooter = styled.div`
  width: 100%;
  padding: 1em;
  border-radius: 8px;
`

const ConversationTextArea = styled(TextArea)`
  &&&& {
    resize: none;
    border: none;
    border-radius: 8px;
    min-height: 100px;
  }
`

const Tip = styled(Paragraph)`
  font-size: 0.7em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const ConversationChat: React.FC<{
  memberId: string
  onFocus: () => void
  onBlur: () => void
}> = ({ memberId, onFocus, onBlur }) => {
  const [draft, setDraft] = useDraftMessage({ memberId })
  const [message, setMessage] = useState(draft)
  const [inputFocused, setInputFocused] = useState(false)
  const [sendMessage, { loading }] = useSendMessageMutation()

  useEffect(() => {
    setMessage(draft)
  }, [memberId])

  const handleOnKeyPress = (e) => {
    if (e.metaKey && e.charCode === Keys.Enter.code && !loading && message) {
      toast.promise(
        sendMessage({
          variables: {
            input: {
              memberId,
              message,
              forceSendMessage: false,
            },
          },
        }),
        {
          loading: 'Sending message',
          success: () => {
            setMessage('')
            setDraft('')
            return 'Message sent'
          },
          error: 'Could not send message',
        },
      )
    }
  }

  return (
    <FadeIn style={{ width: '100%' }}>
      <ConversationContent>
        <Flex style={{ overflowY: 'scroll' }}>
          <MessagesList memberId={memberId} />
        </Flex>
        <ConversationFooter>
          <ConversationTextArea
            onFocus={() => {
              setInputFocused(true)
              onFocus()
            }}
            onBlur={() => {
              setInputFocused(false)
              onBlur()
            }}
            placeholder={'Your message goes here...'}
            value={message}
            onChange={(value) => {
              setDraft(value)
              setMessage(value)
            }}
            onKeyPress={handleOnKeyPress}
          />
        </ConversationFooter>
      </ConversationContent>
      <Flex fullWidth justify={'space-between'} style={{ marginTop: '1.0em' }}>
        <FadeIn duration={200}>
          <Tip>
            <Shadowed>Command</Shadowed> + <Shadowed>Shift</Shadowed> +{' '}
            <Shadowed>Enter</Shadowed> to mark as resolved
          </Tip>
        </FadeIn>
        {inputFocused && (
          <FadeIn duration={200}>
            <Tip>
              <Shadowed>Command</Shadowed> + <Shadowed>Enter</Shadowed> to send
            </Tip>
          </FadeIn>
        )}
      </Flex>
    </FadeIn>
  )
}
