import React from 'react'
import { TemplateMessage } from 'portals/hope/pages/tools/TemplateMessagesPage'

export const SearchTemplate: React.FC<{
  language: 'sweden' | 'denmark' | 'norway'
  selected: TemplateMessage | null
  onSelect: (template: TemplateMessage) => void
}> = ({ language }) => {
  return (
    <div>
      <h1>Search Template ({language})</h1>
    </div>
  )
}
