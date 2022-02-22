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
import { formatLocale, useTemplateMessages } from '../use-template-messages'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import formatDate from 'date-fns/format'
import { PickedLocale } from '../../config/constants'
import toast from 'react-hot-toast'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import {
  Template,
  TemplateMessage,
  UpsertTemplateInput,
} from 'types/generated/graphql'
import { parseISO } from 'date-fns'

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
  onCreate?: (template: UpsertTemplateInput) => void
  onEdit?: (template: Template) => void
  isCreating?: boolean
  onClose?: () => void
  isModal?: boolean
  defaultLocale?: PickedLocale
}

export const TemplateForm: React.FC<
  TemplateFormProps & Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'>
> = ({
  template,
  isCreating,
  onCreate,
  onEdit,
  onClose,
  isModal,
  defaultLocale,
  ...props
}) => {
  const [locales, setLocales] = useState<string[]>([])
  const [expirationDate, setExpirationDate] = useState<string | null>(
    template?.expirationDate || null,
  )

  const { templates } = useTemplateMessages()
  const { confirm } = useConfirmDialog()

  const form = useForm()

  useEffect(() => {
    form.reset()
    setExpirationDate(template?.expirationDate || null)
    setLocales(
      defaultLocale
        ? [defaultLocale]
        : template?.messages.map((msg) => msg.language as string) || [
            formatLocale(PickedLocale.SvSe),
          ],
    )
  }, [template])

  const getMessages = (values: FieldValues): TemplateMessage[] => {
    const messages: TemplateMessage[] = []

    Object.values(PickedLocale).forEach((locale) => {
      if (values[`message-${locale}`]) {
        messages.push({
          message: values[`message-${locale}`],
          language: locale,
        })
      }
    })

    return [
      ...messages,
      {
        message: values.messageEn,
        language: PickedLocale.EnSe,
      },
    ]
  }

  const createHandler = (values: FieldValues) => {
    if (!onCreate) {
      return
    }

    if (
      templates.some(
        (template) => template.title === values.title,
        template?.messages.some((msg) =>
          locales.includes(msg.language as PickedLocale),
        ),
      )
    ) {
      toast.error(`Template with name '${values.name}' already exist`)
      return
    }

    const newTemplate: UpsertTemplateInput = {
      id: template?.id,
      title: values.title,
      messages: getMessages(values),
      expirationDate,
    }

    onCreate(newTemplate)
  }

  const editHandler = (values: FieldValues) => {
    if (isCreating || !template || !onEdit) {
      return
    }

    const newTemplate: Template = {
      id: template.id,
      title: values.title,
      messages: getMessages(values),
      expirationDate,
      pinned: template.pinned,
    }

    onEdit(newTemplate)
  }

  return (
    <FormProvider {...form}>
      <Form
        onSubmit={isCreating ? createHandler : editHandler}
        style={{ height: '100%' }}
        {...props}
      >
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
            checked={locales.includes(formatLocale(PickedLocale.SvSe))}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setLocales((prev) => [...prev, formatLocale(PickedLocale.SvSe)])
              } else {
                setLocales((prev) =>
                  prev.filter(
                    (market) => market !== formatLocale(PickedLocale.SvSe),
                  ),
                )
                form.unregister(`message-${PickedLocale.SvSe}`)
              }
            }}
          />
          <Checkbox
            style={{ marginBottom: '0.5rem' }}
            name="market"
            label={<span>Norway 🇳🇴</span>}
            checked={locales.includes(formatLocale(PickedLocale.NbNo))}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setLocales((prev) => [...prev, formatLocale(PickedLocale.NbNo)])
              } else {
                setLocales((prev) =>
                  prev.filter(
                    (market) => market !== formatLocale(PickedLocale.NbNo),
                  ),
                )
                form.unregister(`message-${PickedLocale.NbNo}`)
              }
            }}
          />
          <Checkbox
            name="market"
            label={<span>Denmark 🇩🇰</span>}
            checked={locales.includes(formatLocale(PickedLocale.DaDk))}
            onChange={({ currentTarget: { checked } }) => {
              if (checked) {
                setLocales((prev) => [...prev, formatLocale(PickedLocale.DaDk)])
              } else {
                setLocales((prev) =>
                  prev.filter(
                    (market) => market !== formatLocale(PickedLocale.DaDk),
                  ),
                )
                form.unregister(`message-${PickedLocale.DaDk}`)
              }
            }}
          />
        </Field>

        {Object.values(PickedLocale).map(
          (locale) =>
            locales.includes(formatLocale(locale)) && (
              <MessageField
                key={locale}
                label={`Message (${formatLocale(locale)})`}
                name={`message-${locale}`}
                placeholder="Message goes here"
                style={{ marginTop: '0.5rem' }}
                defaultValue={
                  template?.messages.find(
                    (msg) => msg.language === formatLocale(locale),
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
            template?.messages.find((msg) => msg.language === PickedLocale.EnSe)
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

        <Field>
          <Checkbox
            label={<span>Set Expiry Date</span>}
            checked={!!expirationDate}
            onChange={({ currentTarget: { checked } }) => {
              setExpirationDate(
                checked ? formatDate(new Date(), 'yyyy-MM-dd') : null,
              )
            }}
          />
        </Field>

        {!!expirationDate && (
          <Field>
            <Label>This template will be deleted after</Label>
            <TextDatePicker
              minDate={new Date()}
              value={
                formatDate(
                  parseISO(new Date(expirationDate).toISOString()),
                  'yyyy-MM-dd',
                ).split('T')[0]
              }
              onChange={(value) => {
                if (!value) {
                  setExpirationDate(null)
                  return
                }

                setExpirationDate(value)
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
