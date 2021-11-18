import styled from '@emotion/styled'
import { FadeIn, Flex, Paragraph, Shadowed, TextArea } from '@hedvig-ui'
import {
  isKeyPressed,
  Keys,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { usePlatform } from '@hedvig-ui/hooks/use-platform'
import { useDraftMessage } from 'features/member/messages/hooks/use-draft-message'
import { MessagesList } from 'features/member/messages/MessagesList'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetQuestionsGroupsDocument,
  useMarkQuestionAsResolvedMutation,
  useSendMessageMutation,
} from 'types/generated/graphql'

const ConversationContent = styled.div`
  background-color: ${({ theme }) => theme.accentBackground};
  width: 100%;
  height: 90%;
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
  onResolve: () => void
}> = ({ memberId, onFocus, onBlur, onResolve }) => {
  const [draft, setDraft] = useDraftMessage({ memberId })
  const [message, setMessage] = useState(draft)
  const [inputFocused, setInputFocused] = useState(false)
  const [sendMessage] = useSendMessageMutation()
  const { isMetaKey, metaKey } = usePlatform()
  const [markAsResolved, { loading }] = useMarkQuestionAsResolvedMutation({
    refetchQueries: [
      {
        query: GetQuestionsGroupsDocument,
      },
    ],
  })

  useEffect(() => {
    setMessage(draft)
  }, [memberId])

  const handleOnKeyDown = (e) => {
    if (isMetaKey(e) && isKeyPressed(e, Keys.Enter) && !loading && message) {
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
      return
    }

    if (
      isMetaKey(e) &&
      isKeyPressed(e, Keys.Enter) &&
      e.shiftKey &&
      !loading &&
      !message
    ) {
      toast.promise(
        markAsResolved({
          variables: { memberId },
          optimisticResponse: {
            markQuestionAsResolved: true,
          },
        }),
        {
          loading: 'Marking as resolved',
          success: () => {
            onResolve()
            return 'Marked as resolved'
          },
          error: 'Could not mark as resolved',
        },
      )
    }
  }

  return (
    <FadeIn style={{ width: '100%', height: '100%' }}>
      <ConversationContent>
        <MessagesList memberId={memberId} />
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
            onChange={(e) => {
              setDraft(e.currentTarget.value)
              setMessage(e.currentTarget.value)
            }}
            onKeyDown={handleOnKeyDown}
          />
        </ConversationFooter>
      </ConversationContent>
      <Flex fullWidth justify={'space-between'} style={{ marginTop: '1.0em' }}>
        <FadeIn duration={200}>
          <Tip>
            <Shadowed>{metaKey.hint}</Shadowed> + <Shadowed>Shift</Shadowed> +{' '}
            <Shadowed>Enter</Shadowed> to mark as resolved
          </Tip>
        </FadeIn>
        {inputFocused && (
          <FadeIn duration={200}>
            <Tip>
              <Shadowed>{metaKey.hint}</Shadowed> + <Shadowed>Enter</Shadowed>{' '}
              to send
            </Tip>
          </FadeIn>
        )}
      </Flex>
    </FadeIn>
  )
}
