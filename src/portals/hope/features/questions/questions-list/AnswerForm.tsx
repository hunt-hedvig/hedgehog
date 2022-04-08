import styled from '@emotion/styled'
import {
  Button,
  Checkbox,
  FadeIn,
  isPressing,
  Shadowed,
  Spacing,
  TextArea,
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetQuestionsGroupsDocument,
  useAnswerQuestionMutation,
  useMarkQuestionAsResolvedMutation,
} from 'types/generated/graphql'
import { usePlatform } from '@hedvig-ui/hooks/use-platform'

const SpacingStyled = styled(Spacing)`
  & .form__field {
    margin-bottom: 10px;
  }
`

const MarkAsResolvedWrapper = styled.div`
  display: flex;
`

const SubmitButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 1rem;
`

const CheckTip = styled.div`
  width: fit-content;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};

  position: absolute;
  right: 0;
`

export const AnswerForm: React.FC<{
  memberId: string
  onDone: () => void
  onError: () => void
  isFocused: boolean
}> = ({ memberId, onDone, onError, isFocused }) => {
  const [answer, setAnswer] = useState<string>()

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const { isMetaKey } = usePlatform()
  const isEnterPressed = useKeyIsPressed(Keys.Enter)
  const isCommandPressed = useKeyIsPressed(Keys.Command)

  const [answerQuestion, { loading: loadingAnswerQuestion }] =
    useAnswerQuestionMutation()

  const [markQuestionAsResolved, { loading: loadingMarkQuestionAsResolved }] =
    useMarkQuestionAsResolvedMutation()

  const loading = loadingAnswerQuestion || loadingMarkQuestionAsResolved

  const onSubmit = () => {
    if (!answer) {
      return
    }

    onDone()
    toast.promise(
      answerQuestion({
        variables: {
          memberId,
          answer,
        },
        refetchQueries: [
          {
            query: GetQuestionsGroupsDocument,
          },
        ],
      }),
      {
        loading: 'Sending answer',
        success: 'Answer sent',
        error: () => {
          onError()
          return 'Could not send answer'
        },
      },
    )
  }

  const handleMarkAsResolved = () => {
    onDone()
    toast.promise(
      markQuestionAsResolved({
        variables: {
          memberId,
        },
        refetchQueries: [
          {
            query: GetQuestionsGroupsDocument,
          },
        ],
      }),
      {
        loading: 'Resolving',
        success: 'Marked as resolved',
        error: () => {
          onError()
          return 'Could not mark as resolved'
        },
      },
    )
  }

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        textAreaRef.current?.focus()
      })
    } else {
      textAreaRef.current?.blur()
    }
  }, [isFocused])

  useEffect(() => {
    if (isEnterPressed && isCommandPressed && !isFocused) {
      handleMarkAsResolved()
    }
  }, [isEnterPressed, isCommandPressed])

  return (
    <>
      <SpacingStyled top="small" bottom="small">
        <TextArea
          value={answer}
          onChange={({ currentTarget: { value } }) => setAnswer(value)}
          ref={textAreaRef}
          onKeyDown={(e) => {
            if (isMetaKey(e) && isPressing(e, Keys.Enter) && isFocused) {
              onSubmit()
            }
          }}
        />
        <SubmitButtonWrapper>
          <Button onClick={onSubmit}>Send</Button>
        </SubmitButtonWrapper>
      </SpacingStyled>
      <MarkAsResolvedWrapper>
        <Checkbox
          label="Mark as resolved"
          onChange={() => handleMarkAsResolved()}
          disabled={loading}
        />
      </MarkAsResolvedWrapper>
      {!isFocused && (
        <FadeIn duration={200}>
          <CheckTip>
            Press <Shadowed>Command</Shadowed> + <Shadowed>Enter</Shadowed> to
            mark as resolved
          </CheckTip>
        </FadeIn>
      )}
      {isFocused && (
        <FadeIn duration={200}>
          <CheckTip>
            Press <Shadowed>Command</Shadowed> + <Shadowed>Enter</Shadowed> to
            send
          </CheckTip>
        </FadeIn>
      )}
    </>
  )
}
