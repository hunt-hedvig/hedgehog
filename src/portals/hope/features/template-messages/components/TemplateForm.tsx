import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import {
  Label,
  Checkbox as DefaultCheckbox,
  TextDatePicker,
  Button,
  ButtonsGroup,
  Form,
  FormTextArea,
  FormInput,
} from '@hedvig-ui'
import { useTemplateMessages } from '../use-template-messages'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import formatDate from 'date-fns/format'
import { Market } from '../../config/constants'
import toast from 'react-hot-toast'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { Template, TemplateMessage } from 'types/generated/graphql'

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
    color: ${({ theme }) => theme.foreground};
    background-color: ${({ theme }) => theme.backgroundLight};
    flex: 1;
  }
`

const Checkbox = styled(DefaultCheckbox)`
  & * {
    color: ${({ theme }) => theme.foreground} !important;
  }
`

interface TemplateFormProps {
  template?: Template
  onSubmit: (template: Template) => void
  isCreating?: boolean
  onClose?: () => void
  isModal?: boolean
  defaultMarket?: Market
}

export const TemplateForm: React.FC<
  TemplateFormProps & Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'>
> = ({
  template,
  isCreating,
  onSubmit,
  onClose,
  isModal,
  defaultMarket,
  ...props
}) => {
  const [markets, setMarkets] = useState<Market[]>([])
  const [expiryDate, setExpiryDate] = useState<string | null>(
    template?.expirationDate || null,
  )

  const { templates } = useTemplateMessages()
  const { confirm } = useConfirmDialog()

  const form = useForm()

  useEffect(() => {
    form.reset()
    setExpiryDate(template?.expirationDate || null)
    // setMarkets(
    //   defaultMarket ? [defaultMarket] : template?.market || [Market.Sweden],
    // )
  }, [template])

  const submitHandler = (values: FieldValues) => {
    if (expiryDate) {
      const today = new Date().setHours(0, 0, 0, 0)
      const valueDay = new Date(expiryDate).setHours(0, 0, 0, 0)

      if (valueDay < today) {
        toast.error('Expiry date should not be earlier than today')
        return
      }
    }

    if (
      isCreating &&
      templates.some(
        (template) => template.title === values.name,
        // template.market.some((market) => markets.includes(market)),
      )
    ) {
      toast.error(`Template with name '${values.name}' already exist`)
      return
    }

    const messages: TemplateMessage[] = []

    Object.values(Market).forEach((market) => {
      if (values[`message-${market}`]) {
        messages.push({
          message: values[`message-${market}`],
          language: market,
        })
      }
    })

    const newTemplate: Template = {
      id: template?.id || uuidv4(),
      title: values.name,
      messages,
      pinned: false,
      // messageEn: values.messageEn,
      // market: markets,
      expirationDate: expiryDate,
    }

    onSubmit(newTemplate)
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={submitHandler} style={{ height: '100%' }} {...props}>
        <FormInput
          label="Template Name"
          placeholder="Write template name here..."
          name="name"
          defaultValue={template?.title || ''}
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
            label={<span>Sweden 🇸🇪</span>}
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
            label={<span>Norway 🇳🇴</span>}
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
            label={<span>Denmark 🇩🇰</span>}
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
        {markets.includes(Market.Sweden) && (
          <MessageField
            label={`Message (SE)`}
            name={`message-${Market.Sweden}`}
            placeholder="Message goes here"
            style={{ marginTop: '0.5rem' }}
            defaultValue={
              template?.messages.find((msg) => msg.language === Market.Sweden)
                ?.message || ''
            }
            rules={{
              required: false,
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
            placeholder="Message goes here"
            style={{ marginTop: '0.5rem' }}
            defaultValue={
              template?.messages.find((msg) => msg.language === Market.Denmark)
                ?.message || ''
            }
            rules={{
              required: false,
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
            placeholder="Message goes here"
            style={{ marginTop: '0.5rem' }}
            defaultValue={
              template?.messages.find((msg) => msg.language === Market.Norway)
                ?.message || ''
            }
            rules={{
              required: false,
              pattern: {
                value: /[^\s]/,
                message: 'Cannot send a message without text',
              },
            }}
          />
        )}

        <MessageField
          label="Message (EN)"
          name="messageEn"
          placeholder="Message goes here"
          style={{ marginTop: '0.5rem' }}
          // defaultValue={template?.messageEn || ''}
          defaultValue={''}
          rules={{
            required: false,
            pattern: {
              value: /[^\s]/,
              message: 'Cannot send a message without text',
            },
          }}
        />

        <Field>
          <Checkbox
            label={<span>Set Expiry Date</span>}
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
                if (!value) {
                  setExpiryDate(null)
                  return
                }

                setExpiryDate(value)
              }}
              style={{ marginTop: '0.5rem' }}
            />
          </Field>
        )}

        <ButtonsGroup style={{ marginTop: isModal ? 15 : 'auto' }}>
          <Button type="submit">
            {isCreating ? 'Create' : 'Save Changes'}
          </Button>
          {onClose && (
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                confirm('Confirm leaving without saving?').then(() => {
                  onClose()
                })
              }}
            >
              Discard
            </Button>
          )}
        </ButtonsGroup>
      </Form>
    </FormProvider>
  )
}
