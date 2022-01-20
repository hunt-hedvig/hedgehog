import React, { createContext, useContext, useState } from 'react'
import { TemplateMessages } from './components/TemplateMessages'

interface TemplateMessagesContextProps {
  show: () => void
  select: (text: string) => void
  selected: string | null
}

const TemplateMessagesContext = createContext<TemplateMessagesContextProps>({
  show: () => void 0,
  select: () => void 0,
  selected: null,
})

export const useTemplateMessages = () => useContext(TemplateMessagesContext)

export const TemplateMessagesProvider: React.FC = ({ children }) => {
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [showTemplateMessages, setShowTemplateMessages] = useState(false)

  return (
    <TemplateMessagesContext.Provider
      value={{
        show: () => setShowTemplateMessages(true),
        select: (text: string) => setSelectedText(text),
        selected: selectedText,
      }}
    >
      {children}
      {showTemplateMessages && (
        <TemplateMessages hide={() => setShowTemplateMessages(false)} />
      )}
    </TemplateMessagesContext.Provider>
  )
}
