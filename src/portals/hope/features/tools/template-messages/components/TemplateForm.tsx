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
import { Message, TemplateMessage } from '../use-template-messages'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import formatDate from 'date-fns/format'
import { Market } from '../../../config/constants'

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
  const [markets, setMarkets] = useState<Market[]>(
    template?.market || [Market.Sweden],
  )
  const [expiryDate, setExpiryDate] = useState(template?.expiryDate || null)

  const form = useForm()

  useEffect(() => {
    form.reset()
    setExpiryDate(template?.expiryDate || null)
    setMarkets(template?.market || [Market.Sweden])
  }, [template])

  const submitHandler = (values: FieldValues) => {
    const messages: Message[] = []

    Object.values(Market).forEach((market) => {
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
      market: markets,
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
            checked={markets.includes(Market.Sweden)}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setMarkets((prev) => [...prev, Market.Sweden])
              } else {
                setMarkets((prev) =>
                  prev.filter((market) => market !== Market.Sweden),
                )
                form.unregister(`message-${Market.Sweden}`)
              }
            }}
          />
          <Checkbox
            style={{ marginBottom: '0.5rem' }}
            name="market"
            label="Norway 🇳🇴"
            checked={markets.includes(Market.Norway)}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setMarkets((prev) => [...prev, Market.Norway])
              } else {
                setMarkets((prev) =>
                  prev.filter((market) => market !== Market.Norway),
                )
                form.unregister(`message-${Market.Norway}`)
              }
            }}
          />
          <Checkbox
            name="market"
            label="Denmark 🇩🇰"
            checked={markets.includes(Market.Denmark)}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setMarkets((prev) => [...prev, Market.Denmark])
              } else {
                setMarkets((prev) =>
                  prev.filter((market) => market !== Market.Denmark),
                )
                form.unregister(`message-${Market.Denmark}`)
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
        {markets.includes(Market.Sweden) && (
          <MessageField
            label={`Message (SE)`}
            name={`message-${Market.Sweden}`}
            style={{ marginTop: '0.5rem' }}
            defaultValue={
              template?.messages.find((msg) => msg.market === Market.Sweden)
                ?.text || ''
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

        {markets.includes(Market.Denmark) && (
          <MessageField
            label={`Message (DK)`}
            name={`message-${Market.Denmark}`}
            style={{ marginTop: '0.5rem' }}
            defaultValue={
              template?.messages.find((msg) => msg.market === Market.Denmark)
                ?.text || ''
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

        {markets.includes(Market.Norway) && (
          <MessageField
            label={`Message (NO)`}
            name={`message-${Market.Norway}`}
            style={{ marginTop: '0.5rem' }}
            defaultValue={
              template?.messages.find((msg) => msg.market === Market.Norway)
                ?.text || ''
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
            checked={!!expiryDate}
            onChange={({ currentTarget: { checked } }) => {
              setExpiryDate(
                checked ? formatDate(new Date(), 'yyyy-MM-dd') : null,
              )
            }}
          />
        </Field>
        {!!expiryDate && (
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
