import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Languages, TemplateMessage } from './templates'
import { TemplateForm } from './TemplateForm'

const Content = styled.div`
  flex: 1;
  padding: 1.25rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.border};

  display: flex;
  flex-direction: column;
`

export const CreateTemplate: React.FC<{
  onClose: () => void
  onCreate: (template: TemplateMessage) => void
}> = ({ onClose, onCreate }) => {
  const [template, setTemplate] = useState<TemplateMessage>({
    id: '',
    name: '',
    message: '',
    messageEn: '',
    market: Languages.Sweden,
  })

  const changeHandler = (field: string, value?: string | boolean | number) => {
    setTemplate((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Content>
      {template && (
        <TemplateForm
          template={template}
          onChange={changeHandler}
          onSave={() => onCreate(template)}
          isCreating
          onClose={onClose}
        />
      )}
    </Content>
  )
}
