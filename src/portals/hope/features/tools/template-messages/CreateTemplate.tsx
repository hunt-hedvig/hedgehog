import React, { useState } from 'react'
import styled from '@emotion/styled'
import { TemplateMessage } from './templates'
import { TemplateForm } from './TemplateForm'

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
  const [template, setTemplate] = useState<TemplateMessage>({})

  const changeHandler = (field: string, value?: string | boolean | number) => {
    setTemplate((prev) => ({ ...prev, [field]: value }))
  }

  const createHandler = () => {
    console.log(template)
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
