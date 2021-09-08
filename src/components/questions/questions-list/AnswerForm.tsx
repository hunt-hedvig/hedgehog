import styled from '@emotion/styled'
import { Checkbox, Form, FormTextArea, Spacing, SubmitButton } from '@hedvig-ui'
import Grid from '@material-ui/core/Grid'
import {
  getAnswerQuestionOptions,
  useAnswerQuestion,
} from 'graphql/use-answer-question'
import {
  getMarkQuestionAsResolvedOptions,
  useMarkQuestionAsResolved,
} from 'graphql/use-mark-question-as-resolved'
import React from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

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

export const AnswerForm: React.FC<{
  memberId: string
  onDone: () => void
  onError: () => void
}> = ({ memberId, onDone, onError }) => {
  const form = useForm()

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

  return (
    <>
      <Spacing top="small" bottom="small">
        <FormProvider {...form}>
          <Form onSubmit={onSubmit}>
            <Grid container spacing={24}>
              <Grid item xs={9}>
                <FormTextArea
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
    </>
  )
}
