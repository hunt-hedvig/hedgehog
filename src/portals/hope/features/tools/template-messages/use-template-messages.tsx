import React, { createContext, useContext, useState } from 'react'
import { TemplateMessages } from './components/TemplateMessages'
import { v4 as uuidv4 } from 'uuid'

export enum Languages {
  Sweden = 'sweden',
  Denmark = 'denmark',
  Norway = 'norway',
}
export interface TemplateMessage {
  name: string
  id: string
  market: Languages
  message: string
  messageEn: string
  withExpiry?: boolean
  expiryDate?: string | null
}

interface TemplateMessagesContextProps {
  show: () => void
  createTemplate: (template: TemplateMessage) => string | undefined
  editTemplate: (template: TemplateMessage) => void
  deleteTemplate: (id: string) => void
  select: (text: string) => void
  selected: string | null
}

const TemplateMessagesContext = createContext<TemplateMessagesContextProps>({
  show: () => void 0,
  createTemplate: () => '',
  editTemplate: () => void 0,
  deleteTemplate: () => void 0,
  select: () => void 0,
  selected: null,
})

export const useTemplateMessages = () => useContext(TemplateMessagesContext)

export const TemplateMessagesProvider: React.FC = ({ children }) => {
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [showTemplateMessages, setShowTemplateMessages] = useState(false)

  const createHandler = (template: TemplateMessage) => {
    const allTemplates = localStorage.getItem('hedvig:messages:templates')

    const id = uuidv4()
    const newTemplate = { ...template, id }

    if (!allTemplates) {
      localStorage.setItem(
        'hedvig:messages:templates',
        JSON.stringify([newTemplate]),
      )

      return
    }

    const newTemplates = [...JSON.parse(allTemplates), newTemplate]
    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify(newTemplates),
    )

    return id
  }

  const editHandler = (template: TemplateMessage) => {
    const allTemplates = localStorage.getItem('hedvig:messages:templates')

    if (!template || !allTemplates) {
      return
    }

    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify([
        ...JSON.parse(allTemplates).map((template) => {
          if (template.id === template.id) {
            return template
          }
          return template
        }),
      ]),
    )
  }

  const deleteHandler = (id: string) => {
    const allTemplates = localStorage.getItem('hedvig:messages:templates')

    if (!allTemplates) {
      return
    }

    const newTemplates = JSON.parse(allTemplates).filter(
      (template) => template.id !== id,
    )

    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify(newTemplates),
    )
  }

  return (
    <TemplateMessagesContext.Provider
      value={{
        show: () => setShowTemplateMessages(true),
        createTemplate: createHandler,
        editTemplate: editHandler,
        deleteTemplate: deleteHandler,
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
