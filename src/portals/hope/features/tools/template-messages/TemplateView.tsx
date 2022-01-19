import React, { useState } from 'react'
import styled from '@emotion/styled'
import {
  Label,
  Input,
  Checkbox,
  TextArea,
  TextDatePicker,
  Button,
} from '@hedvig-ui'
import { Languages, TemplateMessage } from './templates'

const Content = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  padding: 1.25rem 1.5rem;

  overflow-y: auto;
`

const Field = styled.div`
  margin-bottom: 1.25rem;
`

const MessageField = styled(TextArea)`
  height: 10rem;
  margin-top: 0.5rem;
`

export const TemplateView: React.FC<{
  language: 'sweden' | 'denmark' | 'norway'
  template: TemplateMessage | null
  onChange: (field: string, value: string) => void
  onSave: () => void
}> = ({ language, template, onChange }) => {
  const [isExpiryDate, setIsExpiryDate] = useState(template?.withExpiry)

  console.log(language)

  return (
    <Content>
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
        />
        <Checkbox
          style={{ marginBottom: '0.5rem' }}
          label="Norway 🇳🇴"
          checked={template?.market === Languages.Norway}
        />
        <Checkbox
          label="Denmark 🇩🇰"
          checked={template?.market === Languages.Denmark}
        />
      </Field>
      <Field>
        <Label>Message (EN)</Label>
        <MessageField />
      </Field>
      <Field>
        <Label>Message (SV)</Label>
        <MessageField />
      </Field>
      <Field>
        <Checkbox
          label="Set Expiry Date"
          checked={isExpiryDate}
          onChange={({ currentTarget: { checked } }) =>
            setIsExpiryDate(Boolean(checked))
          }
        />
      </Field>
      {isExpiryDate && (
        <Field>
          <Label>This template will be deleted after</Label>
          <TextDatePicker
            onChange={(e) => {
              console.log(e)
            }}
            style={{ marginTop: '0.5rem' }}
          />
        </Field>
      )}

      <Button style={{ marginTop: '1rem' }}>Save Changes</Button>
    </Content>
  )
}
