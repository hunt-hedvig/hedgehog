import styled from '@emotion/styled'
import {
  Checkbox,
  FadeIn,
  Form,
  FormTextArea,
  Shadowed,
  Spacing,
  SubmitButton,
} from '@hedvig-ui'
import { Keys, useKeyIsPressed } from '@hedvig-ui/utils/key-press-hook'
import React, { useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  GetQuestionsGroupsDocument,
  useAnswerQuestionMutation,
  useMarkQuestionAsResolvedMutation,
} from 'types/generated/graphql'

const SpacingStyled = styled(Spacing)`
  & .form__field {
    margin-bottom: 10px;
  }
`

const MarkAsResolvedWrapper = styled.div`
  padding-left: 1rem;
  display: flex;
`

const SubmitButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
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
  isGroupFocused: boolean
}> = ({ memberId, onDone, onError, isGroupFocused, isFocused }) => {
  const form = useForm()
  const isEnterPressed = useKeyIsPressed(Keys.Enter)
  const isCommandPressed = useKeyIsPressed(Keys.Command)

  const [
    answerQuestion,
    { loading: loadingAnswerQuestion },
  ] = useAnswerQuestionMutation()

  const [
    markQuestionAsResolved,
    { loading: loadingMarkQuestionAsResolved },
  ] = useMarkQuestionAsResolvedMutation()

  const loading =
    loadingAnswerQuestion ||
    loadingMarkQuestionAsResolved ||
    form.formState.isSubmitting

  const onSubmit = (data: FieldValues) => {
    onDone()
    toast.promise(
      answerQuestion({
        variables: {
          memberId,
          answer: data.answer.trim(),
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
    if (isEnterPressed && isCommandPressed && isGroupFocused && !isFocused) {
      handleMarkAsResolved()
    }
    if (isEnterPressed && isCommandPressed && isFocused) {
      onSubmit(form.getValues())
    }
  }, [isEnterPressed, isCommandPressed])

  return (
    <>
      <SpacingStyled top="small" bottom="small">
        <FormProvider {...form}>
          <Form onSubmit={onSubmit}>
            <FormTextArea
              focus={isFocused}
              name="answer"
              defaultValue=""
              rules={{
                required: 'Cannot send an empty message',
                pattern: {
                  value: /[^\s]/,
                  message: 'Cannot send a message without text',
                },
              }}
            />
            <SubmitButtonWrapper>
              <SubmitButton>Send</SubmitButton>
            </SubmitButtonWrapper>
          </Form>
        </FormProvider>
      </SpacingStyled>
      <MarkAsResolvedWrapper>
        <Checkbox
          label="Mark as resolved"
          onChange={() => handleMarkAsResolved()}
          disabled={loading}
        />
      </MarkAsResolvedWrapper>
      {isGroupFocused && !isFocused && (
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
