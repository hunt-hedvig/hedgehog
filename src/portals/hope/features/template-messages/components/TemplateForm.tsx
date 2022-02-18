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
import { Language, useTemplateMessages } from '../use-template-messages'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import formatDate from 'date-fns/format'
import { Market } from '../../config/constants'
import toast from 'react-hot-toast'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { TemplateMessage, UpsertTemplateInput } from 'types/generated/graphql'

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
  template?: UpsertTemplateInput
  onSubmit: (template: UpsertTemplateInput) => void
  isCreating?: boolean
  onClose?: () => void
  isModal?: boolean
  defaultMarket?: Language
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
  const [languages, setLanguages] = useState<Language[]>([])
  const [expiryDate, setExpiryDate] = useState<string | null>(
    template?.expirationDate || null,
  )

  const { templates } = useTemplateMessages()
  const { confirm } = useConfirmDialog()

  const form = useForm()

  useEffect(() => {
    form.reset()
    setExpiryDate(template?.expirationDate || null)
    setLanguages(
      defaultMarket
        ? [defaultMarket]
        : template?.messages.map((msg) => msg.language as Language) || [
            Language[Market.Sweden],
          ],
    )
  }, [template])

  const submitHandler = (values: FieldValues) => {
    if (
      isCreating &&
      templates.some(
        (template) => template.title === values.title,
        template?.messages.some((msg) =>
          languages.includes(msg.language as Language),
        ),
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

    const newTemplate: UpsertTemplateInput = {
      id: template?.id,
      title: values.title,
      messages: [
        ...messages,
        {
          message: values.messageEn,
          language: 'ENGLISH',
        },
      ],
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
          name="title"
          defaultValue={template?.title || ''}
          style={{ marginTop: '0.5rem' }}
          rules={{
            required: 'Name is required',
            pattern: {
              value: /[^\s]/,
              message: 'Name cannot be an empty string',
            },
          }}
        />
        <Field>
          <Label>Apply to Market</Label>
          <Checkbox
            style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
            name="market"
            label={<span>Sweden 🇸🇪</span>}
            checked={languages.includes(Language[Market.Sweden])}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setLanguages((prev) => [...prev, Language[Market.Sweden]])
              } else {
                setLanguages((prev) =>
                  prev.filter((market) => market !== Language[Market.Sweden]),
                )
                form.unregister(`message-${Market.Sweden}`)
              }
            }}
          />
          <Checkbox
            style={{ marginBottom: '0.5rem' }}
            name="market"
            label={<span>Norway 🇳🇴</span>}
            checked={languages.includes(Language[Market.Norway])}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setLanguages((prev) => [...prev, Language[Market.Norway]])
              } else {
                setLanguages((prev) =>
                  prev.filter((market) => market !== Language[Market.Norway]),
                )
                form.unregister(`message-${Market.Norway}`)
              }
            }}
          />
          <Checkbox
            name="market"
            label={<span>Denmark 🇩🇰</span>}
            checked={languages.includes(Language[Market.Denmark])}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setLanguages((prev) => [...prev, Language[Market.Denmark]])
              } else {
                setLanguages((prev) =>
                  prev.filter((market) => market !== Language[Market.Denmark]),
                )
                form.unregister(`message-${Market.Denmark}`)
              }
            }}
          />
        </Field>

        {Object.values(Market).map(
          (market) =>
            languages.includes(Language[market]) && (
              <MessageField
                label={`Message (${Language[market]})`}
                name={`message-${market}`}
                placeholder="Message goes here"
                style={{ marginTop: '0.5rem' }}
                defaultValue={
                  template?.messages.find(
                    (msg) => msg.language === Language[market],
                  )?.message || ''
                }
                rules={{
                  required: false,
                  pattern: {
                    value: /[^\s]/,
                    message: 'Cannot send a message without text',
                  },
                }}
              />
            ),
        )}

        <MessageField
          label="Message (EN)"
          name="messageEn"
          placeholder="Message goes here"
          style={{ marginTop: '0.5rem' }}
          defaultValue={
            template?.messages.find((msg) => msg.language === 'EN')?.message ||
            ''
          }
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
              minDate={new Date()}
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
