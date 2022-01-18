import React from 'react'

export const CreateTemplate: React.FC<{
  language: 'sweden' | 'denmark' | 'norway'
}> = ({ language }) => {
  return (
    <div>
      <h1>Create Template ({language})</h1>
    </div>
  )
}
