import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Languages, TemplateMessage } from './templates'
import { TemplateForm } from './TemplateForm'
import { v4 as uuidv4 } from 'uuid'

const Content = styled.div`
  flex: 1;
  padding: 1.25rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.border};

  display: flex;
  flex-direction: column;
`

export const CreateTemplate: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
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

  const createHandler = () => {
    const currentTemplates = localStorage.getItem('hedvig:messages:templates')

    if (!currentTemplates) {
      localStorage.setItem(
        'hedvig:messages:templates',
        JSON.stringify([{ ...template, id: uuidv4() }]),
      )

      return
    }

    const parsedTemplates = JSON.parse(currentTemplates)
    const newTemplates = [...parsedTemplates, { ...template, id: uuidv4() }]
    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify(newTemplates),
    )
  }

  return (
    <Content>
      {template && (
        <TemplateForm
          template={template}
          onChange={changeHandler}
          onSave={createHandler}
          isCreating
          onClose={onClose}
        />
      )}
    </Content>
  )
}
