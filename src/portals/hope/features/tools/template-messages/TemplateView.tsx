import React from 'react'
import { TemplateMessage } from 'portals/hope/pages/tools/TemplateMessagesPage'

export const TemplateView: React.FC<{
  language: 'sweden' | 'denmark' | 'norway'
  template: TemplateMessage | null
  onChange: (field: string, value: string) => void
  onSave: () => void
}> = ({ language }) => {
  return (
    <div>
      <h1>Create Template ({language})</h1>
    </div>
  )
}
