import React from 'react'
import styled from '@emotion/styled'

import { TemplateMessage } from './templates'
import { TemplateForm } from './TemplateForm'

const Content = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  padding: 1.25rem 1.5rem;
`

export const TemplateView: React.FC<{
  template: TemplateMessage | null
  onChange: (field: string, value?: string | boolean | number) => void
  onSave: () => void
}> = ({ template, onChange, onSave }) => (
  <Content>
    {template && (
      <TemplateForm template={template} onChange={onChange} onSave={onSave} />
    )}
  </Content>
)
