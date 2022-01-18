import React from 'react'
import { TemplateMessage } from 'portals/hope/pages/tools/TemplateMessagesPage'

export const TemplateView: React.FC<{
  language: 'sweden' | 'denmark' | 'norway'
  template: TemplateMessage | null
  onChange: (field: string, value: string) => void
  onSave: () => void
}> = ({ language, template }) => {
  return (
    <div>
      <h1>View Template ({language})</h1>
      {template && (
        <>
          <h1>Selected Template: </h1>
          <h1>ID: {template.id}</h1>
          <h1>ID: {template.name}</h1>
        </>
      )}
    </div>
  )
}
