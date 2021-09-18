import styled from '@emotion/styled'
import { FadeIn, Flex, Paragraph, Shadowed, TextArea } from '@hedvig-ui'
import { MessagesList } from 'features/member/messages/MessagesList'
import React, { useState } from 'react'

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

const NoteTip = styled(Paragraph)`
  font-size: 0.7em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const ConversationChat: React.FC<{ memberId: string }> = ({
  memberId,
}) => {
  const [message, setMessage] = useState('')
  const [inputFocused, setInputFocused] = useState(false)

  return (
    <>
      <ConversationContent>
        <Flex style={{ overflowY: 'hidden' }}>
          <MessagesList memberId={memberId} />
        </Flex>
        <ConversationFooter>
          <ConversationTextArea
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder={'Your message goes here...'}
            value={message}
            onChange={(value) => setMessage(value)}
          />
        </ConversationFooter>
      </ConversationContent>
      <Flex fullWidth justify={'flex-end'} style={{ marginTop: '1.0em' }}>
        {inputFocused && (
          <FadeIn duration={200}>
            <NoteTip>
              <Shadowed>Command</Shadowed> + <Shadowed>Return</Shadowed> to send
            </NoteTip>
          </FadeIn>
        )}
      </Flex>
    </>
  )
}
