import styled from '@emotion/styled'
import {
  Checkbox,
  FadeIn,
  Form,
  FormTextAreaWithRef,
  Shadowed,
  Spacing,
  SubmitButton,
} from '@hedvig-ui'
import Grid from '@material-ui/core/Grid'
import {
  getAnswerQuestionOptions,
  useAnswerQuestion,
} from 'graphql/use-answer-question'
import {
  getMarkQuestionAsResolvedOptions,
  useMarkQuestionAsResolved,
} from 'graphql/use-mark-question-as-resolved'
import React, { useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'

const MarkAsResolvedWrapper = styled.div`
  padding-left: 1rem;
`

const SubmitButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`

const FlexGrid = styled(Grid)`
  display: flex;
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
  const isOptionPressed = useKeyIsPressed(Keys.Option)

  const [
    answerQuestion,
    { loading: loadingAnswerQuestion },
  ] = useAnswerQuestion()

  const [
    markQuestionAsResolved,
    { loading: loadingMarkQuestionAsResolved },
  ] = useMarkQuestionAsResolved()

  const loading =
    loadingAnswerQuestion ||
    loadingMarkQuestionAsResolved ||
    form.formState.isSubmitting

  const onSubmit = (data: FieldValues) => {
    onDone()
    toast.promise(
      answerQuestion(getAnswerQuestionOptions(memberId, data.answer.trim())),
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
      markQuestionAsResolved(getMarkQuestionAsResolvedOptions(memberId)),
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
    if (isEnterPressed && isOptionPressed && isGroupFocused && !isFocused) {
      handleMarkAsResolved()
    }
    if (isEnterPressed && isOptionPressed && isFocused) {
      onSubmit(form.getValues())
    }
  }, [isEnterPressed, isOptionPressed])

  return (
    <>
      <Spacing top="small" bottom="small">
        <FormProvider {...form}>
          <Form onSubmit={onSubmit}>
            <Grid container spacing={24}>
              <Grid item xs={9}>
                <FormTextAreaWithRef
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
              </Grid>
              <FlexGrid item xs={2}>
                <SubmitButtonWrapper>
                  <SubmitButton variation="primary">Send</SubmitButton>
                </SubmitButtonWrapper>
              </FlexGrid>
            </Grid>
          </Form>
        </FormProvider>
      </Spacing>
      <MarkAsResolvedWrapper>
        <Checkbox
          label="Mark as resolved"
          onClick={() => handleMarkAsResolved()}
          disabled={loading}
        />
      </MarkAsResolvedWrapper>
      {isGroupFocused && !isFocused && (
        <FadeIn duration={200}>
          <CheckTip>
            Press <Shadowed>Option</Shadowed> + <Shadowed>Enter</Shadowed> to
            mark as resolved
          </CheckTip>
        </FadeIn>
      )}
      {isFocused && (
        <FadeIn duration={200}>
          <CheckTip>
            Press <Shadowed>Option</Shadowed> + <Shadowed>Enter</Shadowed> to
            send
          </CheckTip>
        </FadeIn>
      )}
    </>
  )
}
