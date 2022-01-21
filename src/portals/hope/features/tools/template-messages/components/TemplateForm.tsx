import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import {
  Label,
  Checkbox,
  TextDatePicker,
  Button,
  ButtonsGroup,
  Form,
  FormTextArea,
  FormInput,
} from '@hedvig-ui'
import { Markets, TemplateMessage } from '../use-template-messages'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

const Field = styled.div`
  margin-bottom: 1.25rem;
  max-width: 20rem;
`

const MessageField = styled(FormTextArea)`
  height: 10rem;

  display: flex;
  flex-direction: column;

  & textarea {
    margin-top: 0.5rem;
    flex: 1;
  }
`

interface TemplateFormProps {
  template?: TemplateMessage
  onSubmit: (template: TemplateMessage) => void
  isCreating?: boolean
  onClose?: () => void
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  isCreating,
  onSubmit,
  onClose,
}) => {
  const [market, setMarket] = useState(template?.market || Markets.Sweden)
  const [withExpiry, setWithExpiry] = useState(template?.withExpiry || false)
  const [expiryDate, setExpiryDate] = useState(template?.expiryDate || null)

  const form = useForm()

  useEffect(() => {
    form.reset()
    setWithExpiry(template?.withExpiry || false)
    setExpiryDate(template?.expiryDate || null)
    setMarket(template?.market || Markets.Sweden)
  }, [template])

  const submitHandler = ({ name, message, messageEn }: FieldValues) => {
    const newTemplate = {
      id: template?.id || uuidv4(),
      name,
      message,
      messageEn,
      market,
      withExpiry,
      expiryDate,
    }

    onSubmit(newTemplate)
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={submitHandler} style={{ height: '100%' }}>
        <FormInput
          label="Template Name"
          placeholder="Write template name here..."
          name="name"
          defaultValue={template?.name || ''}
          style={{ marginTop: '0.5rem' }}
          rules={{
            required: 'Name is required',
            pattern: {
              value: /[^\s]/,
              message: 'Name cannot be zero',
            },
          }}
        />
        <Field>
          <Label>Apply to Market</Label>
          <Checkbox
            style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
            name="market"
            label="Sweden 🇸🇪"
            checked={market === Markets.Sweden}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setMarket(Markets.Sweden)
              }
            }}
          />
          <Checkbox
            style={{ marginBottom: '0.5rem' }}
            name="market"
            label="Norway 🇳🇴"
            checked={market === Markets.Norway}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setMarket(Markets.Norway)
              }
            }}
          />
          <Checkbox
            name="market"
            label="Denmark 🇩🇰"
            checked={market === Markets.Denmark}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setMarket(Markets.Denmark)
              }
            }}
          />
        </Field>
        <MessageField
          label="Message (EN)"
          name="messageEn"
          style={{ marginTop: '0.5rem' }}
          defaultValue={template?.messageEn || ''}
          rules={{
            required: 'Cannot save an empty message',
            pattern: {
              value: /[^\s]/,
              message: 'Cannot send a message without text',
            },
          }}
        />
        <MessageField
          label={`Message (
              ${
                template?.market === Markets.Sweden
                  ? 'SV'
                  : template?.market === Markets.Denmark
                  ? 'DK'
                  : 'NO'
              }
              )`}
          name="message"
          style={{ marginTop: '0.5rem' }}
          defaultValue={template?.message || ''}
          rules={{
            required: 'Cannot save an empty message',
            pattern: {
              value: /[^\s]/,
              message: 'Cannot send a message without text',
            },
          }}
        />
        <Field>
          <Checkbox
            label="Set Expiry Date"
            checked={withExpiry}
            onChange={({ currentTarget: { checked } }) => {
              setWithExpiry(checked)
            }}
          />
        </Field>
        {withExpiry && (
          <Field>
            <Label>This template will be deleted after</Label>
            <TextDatePicker
              value={expiryDate}
              onChange={(value) => {
                setExpiryDate(value)
              }}
              style={{ marginTop: '0.5rem' }}
            />
          </Field>
        )}

        <ButtonsGroup style={{ marginTop: 'auto' }}>
          <Button type="submit">
            {isCreating ? 'Create' : 'Save Changes'}
          </Button>
          {onClose && (
            <Button variant="secondary" onClick={onClose}>
              Discard
            </Button>
          )}
        </ButtonsGroup>
      </Form>
    </FormProvider>
  )
}
