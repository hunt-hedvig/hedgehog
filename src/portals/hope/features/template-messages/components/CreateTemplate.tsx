import React from 'react'
import styled from '@emotion/styled'
import { TemplateForm } from './TemplateForm'
import { Template } from 'types/generated/graphql'

const Content = styled.div`
  flex: 1;
  padding: 1.25rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.border};

  display: flex;
  flex-direction: column;
`

export const CreateTemplate: React.FC<{
  onClose: () => void
  onCreate: (template: Template) => void
}> = ({ onClose, onCreate }) => {
  return (
    <Content>
      <TemplateForm onSubmit={onCreate} isCreating onClose={onClose} />
    </Content>
  )
}
