import React from 'react'

export const SearchTemplate: React.FC<{
  language: 'sweden' | 'denmark' | 'norway'
}> = ({ language }) => {
  return (
    <div>
      <h1>Search Template ({language})</h1>
    </div>
  )
}
