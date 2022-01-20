import React, { createContext, useContext, useState } from 'react'
import { TemplateMessages } from './components/TemplateMessages'

interface TemplateMessagesContextProps {
  show: () => void
}

const TemplateMessagesContext = createContext<TemplateMessagesContextProps>({
  show: () => void 0,
})

export const useTemplateMessages = () => useContext(TemplateMessagesContext)

export const TemplateMessagesProvider: React.FC = ({ children }) => {
  const [showTemplateMessages, setShowTemplateMessages] = useState(false)

  return (
    <TemplateMessagesContext.Provider
      value={{
        show: () => setShowTemplateMessages(true),
      }}
    >
      {children}
      {showTemplateMessages && (
        <TemplateMessages hide={() => setShowTemplateMessages(false)} />
      )}
    </TemplateMessagesContext.Provider>
  )
}
