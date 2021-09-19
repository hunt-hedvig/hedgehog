import styled from '@emotion/styled'
import { FadeIn, Flex, Paragraph, Shadowed, TextArea } from '@hedvig-ui'
import { MessagesList } from 'features/member/messages/MessagesList'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSendMessageMutation } from 'types/generated/graphql'
import { Keys } from 'utils/hooks/key-press-hook'

const ConversationContent = styled.div`
  background-color: ${({ theme }) => theme.accentBackground};
  height: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
    overflow-y: scroll;
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
  const [message, setMessage] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const [sendMessage, { loading }] = useSendMessageMutation()

  return (
    <FadeIn style={{ width: '100%' }}>
      <ConversationContent>
        <Flex style={{ overflowY: 'hidden' }}>
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
            onChange={(value) => setMessage(value)}
            onKeyPress={(e) => {
              if (
                e.altKey &&
                e.charCode === Keys.Enter.code &&
                !loading &&
                message
              ) {
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
                      return 'Message sent'
                    },
                    error: 'Could not send message',
                  },
                )
              }
            }}
          />
        </ConversationFooter>
      </ConversationContent>
      <Flex fullWidth justify={'space-between'} style={{ marginTop: '1.0em' }}>
        <FadeIn duration={200}>
          <Tip>
            <Shadowed>Option</Shadowed> + <Shadowed>Shift</Shadowed> to mark as
            resolved
          </Tip>
        </FadeIn>
        {inputFocused && (
          <FadeIn duration={200}>
            <Tip>
              <Shadowed>Option</Shadowed> + <Shadowed>Return</Shadowed> to send
            </Tip>
          </FadeIn>
        )}
        {!inputFocused && (
          <FadeIn duration={200}>
            <Tip>
              <Shadowed>Up</Shadowed> or <Shadowed>Down</Shadowed> key to change
              conversation
            </Tip>
          </FadeIn>
        )}
      </Flex>
    </FadeIn>
  )
}
