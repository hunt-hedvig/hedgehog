import React from 'react'
import styled from '@emotion/styled'
import {
  Label,
  Input,
  Checkbox,
  TextArea,
  TextDatePicker,
  Button,
  ButtonsGroup,
} from '@hedvig-ui'
import { Languages, TemplateMessage } from './templates'

const Field = styled.div`
  margin-bottom: 1.25rem;
`

const MessageField = styled(TextArea)`
  height: 10rem;
  margin-top: 0.5rem;
`

interface TemplateFormProps {
  template: TemplateMessage
  onChange: (field: string, value?: string | boolean | number) => void
  onSave: () => void
  isCreating?: boolean
  onClose?: () => void
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  onChange,
  isCreating,
  onSave,
  onClose,
}) => {
  return (
    <>
      <Field>
        <Label>Template Name</Label>
        <Input
          style={{ marginTop: '0.5rem' }}
          value={template?.name}
          onChange={({ target: { value } }) => onChange('name', value)}
        />
      </Field>
      <Field>
        <Label>Apply to Market</Label>
        <Checkbox
          style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
          label="Sweden 🇸🇪"
          checked={template?.market === Languages.Sweden}
          onChange={({ currentTarget: { checked } }) => {
            onChange('market', checked ? Languages.Sweden : undefined)
          }}
        />
        <Checkbox
          style={{ marginBottom: '0.5rem' }}
          label="Norway 🇳🇴"
          checked={template?.market === Languages.Norway}
          onChange={({ currentTarget: { checked } }) => {
            onChange('market', checked ? Languages.Norway : undefined)
          }}
        />
        <Checkbox
          label="Denmark 🇩🇰"
          checked={template?.market === Languages.Denmark}
          onChange={({ currentTarget: { checked } }) => {
            onChange('market', checked ? Languages.Denmark : undefined)
          }}
        />
      </Field>
      <Field>
        <Label>Message (EN)</Label>
        <MessageField
          value={template?.messageEn}
          onChange={({ currentTarget: { value } }) => {
            onChange('messageEn', value)
          }}
        />
      </Field>
      <Field>
        <Label>Message (SV)</Label>
        <MessageField
          value={template?.message}
          onChange={({ currentTarget: { value } }) => {
            onChange('message', value)
          }}
        />
      </Field>
      <Field>
        <Checkbox
          label="Set Expiry Date"
          checked={template?.withExpiry}
          onChange={({ currentTarget: { checked } }) => {
            onChange('withExpiry', checked)
          }}
        />
      </Field>
      {template?.withExpiry && (
        <Field>
          <Label>This template will be deleted after</Label>
          <TextDatePicker
            value={template?.expiryDate}
            onChange={(value) => {
              onChange('expiryDate', value || undefined)
            }}
            style={{ marginTop: '0.5rem' }}
          />
        </Field>
      )}

      <ButtonsGroup style={{ marginTop: 'auto' }}>
        <Button onClick={onSave}>
          {isCreating ? 'Create' : 'Save Changes'}
        </Button>
        {isCreating && onClose && (
          <Button variant="secondary" onClick={onClose}>
            Discard
          </Button>
        )}
      </ButtonsGroup>
    </>
  )
}
