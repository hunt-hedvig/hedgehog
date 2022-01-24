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
import { Markets, Message, TemplateMessage } from '../use-template-messages'
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
  const [markets, setMarkets] = useState<Markets[]>(
    template?.markets || [Markets.Sweden],
  )
  const [withExpiry, setWithExpiry] = useState(template?.withExpiry || false)
  const [expiryDate, setExpiryDate] = useState(template?.expiryDate || null)

  const form = useForm()

  useEffect(() => {
    form.reset()
    setWithExpiry(template?.withExpiry || false)
    setExpiryDate(template?.expiryDate || null)
    setMarkets(template?.markets || [Markets.Sweden])
  }, [template])

  const submitHandler = (values: FieldValues) => {
    const messages: Message[] = []

    Object.values(Markets).forEach((market) => {
      if (values[`message-${market}`]) {
        messages.push({
          text: values[`message-${market}`],
          market,
        })
      }
    })

    const newTemplate: TemplateMessage = {
      id: template?.id || uuidv4(),
      name: values.name,
      messages,
      messageEn: values.messageEn,
      markets,
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
            checked={markets.includes(Markets.Sweden)}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setMarkets((prev) => [...prev, Markets.Sweden])
              } else {
                setMarkets((prev) =>
                  prev.filter((market) => market !== Markets.Sweden),
                )
                form.unregister(`message-${Markets.Sweden}`)
              }
            }}
          />
          <Checkbox
            style={{ marginBottom: '0.5rem' }}
            name="market"
            label="Norway 🇳🇴"
            checked={markets.includes(Markets.Norway)}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setMarkets((prev) => [...prev, Markets.Norway])
              } else {
                setMarkets((prev) =>
                  prev.filter((market) => market !== Markets.Norway),
                )
                form.unregister(`message-${Markets.Norway}`)
              }
            }}
          />
          <Checkbox
            name="market"
            label="Denmark 🇩🇰"
            checked={markets.includes(Markets.Denmark)}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setMarkets((prev) => [...prev, Markets.Denmark])
              } else {
                setMarkets((prev) =>
                  prev.filter((market) => market !== Markets.Denmark),
                )
                form.unregister(`message-${Markets.Denmark}`)
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
        {markets.includes(Markets.Sweden) && (
          <MessageField
            label={`Message (SE)`}
            name={`message-${Markets.Sweden}`}
            style={{ marginTop: '0.5rem' }}
            defaultValue={
              template?.messages.filter(
                (msg) => msg.market === Markets.Sweden,
              )[0].text || ''
            }
            rules={{
              required: 'Cannot save an empty message',
              pattern: {
                value: /[^\s]/,
                message: 'Cannot send a message without text',
              },
            }}
          />
        )}

        {markets.includes(Markets.Denmark) && (
          <MessageField
            label={`Message (DK)`}
            name={`message-${Markets.Denmark}`}
            style={{ marginTop: '0.5rem' }}
            defaultValue={
              template?.messages.filter(
                (msg) => msg.market === Markets.Denmark,
              )[0].text || ''
            }
            rules={{
              required: 'Cannot save an empty message',
              pattern: {
                value: /[^\s]/,
                message: 'Cannot send a message without text',
              },
            }}
          />
        )}

        {markets.includes(Markets.Norway) && (
          <MessageField
            label={`Message (NO)`}
            name={`message-${Markets.Norway}`}
            style={{ marginTop: '0.5rem' }}
            defaultValue={
              template?.messages.filter(
                (msg) => msg.market === Markets.Norway,
              )[0].text || ''
            }
            rules={{
              required: 'Cannot save an empty message',
              pattern: {
                value: /[^\s]/,
                message: 'Cannot send a message without text',
              },
            }}
          />
        )}

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
