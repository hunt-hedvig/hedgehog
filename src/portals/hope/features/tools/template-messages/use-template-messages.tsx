import React, { createContext, useContext, useEffect, useState } from 'react'
import { TemplateMessages } from './components/TemplateMessages'
import { v4 as uuidv4 } from 'uuid'

export enum Languages {
  Sweden = 'SWEDEN',
  Denmark = 'DENMARK',
  Norway = 'NORWAY',
}

export interface TemplateMessage {
  name: string
  id: string
  market: Languages
  message: string
  messageEn: string
  withExpiry?: boolean
  expiryDate?: string | null
  pinned?: boolean
}

interface TemplateMessagesContextProps {
  show: () => void
  createTemplate: (template: TemplateMessage) => string | undefined
  editTemplate: (template: TemplateMessage) => void
  deleteTemplate: (id: string) => void
  pinTemplate: (id: string) => void
  select: (text: string) => void
  selected: string | null
  currentMarket: Languages
  changeCurrentMarket: (market: Languages) => void
}

const TemplateMessagesContext = createContext<TemplateMessagesContextProps>({
  show: () => void 0,
  createTemplate: () => '',
  editTemplate: () => void 0,
  deleteTemplate: () => void 0,
  pinTemplate: () => void 0,
  select: () => void 0,
  selected: null,
  currentMarket: Languages.Sweden,
  changeCurrentMarket: () => void 0,
})

export const useTemplateMessages = () => useContext(TemplateMessagesContext)

export const TemplateMessagesProvider: React.FC = ({ children }) => {
  const [currentMarket, setCurrentMarket] = useState<Languages>(
    Languages.Sweden,
  )
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [showTemplateMessages, setShowTemplateMessages] = useState(false)

  useEffect(() => {
    console.log(currentMarket)
  }, [currentMarket])

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

  const editHandler = (newTemplate: TemplateMessage) => {
    const allTemplates = localStorage.getItem('hedvig:messages:templates')

    if (!newTemplate || !allTemplates) {
      return
    }

    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify([
        ...JSON.parse(allTemplates).map((template) => {
          if (template.id === newTemplate.id) {
            return newTemplate
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

  const pinHandler = (id: string) => {
    const allTemplates = localStorage.getItem('hedvig:messages:templates')

    if (!allTemplates) {
      return
    }

    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify([
        ...JSON.parse(allTemplates).map((template) => {
          if (id === template.id) {
            return { ...template, pinned: template.pinned ? false : true }
          }
          return template
        }),
      ]),
    )
  }

  const changeCurrentMarket = (market: Languages) => setCurrentMarket(market)

  return (
    <TemplateMessagesContext.Provider
      value={{
        show: () => setShowTemplateMessages(true),
        createTemplate: createHandler,
        editTemplate: editHandler,
        deleteTemplate: deleteHandler,
        pinTemplate: pinHandler,
        select: (text: string) => setSelectedText(text),
        selected: selectedText,
        currentMarket,
        changeCurrentMarket,
      }}
    >
      {children}
      {showTemplateMessages && (
        <TemplateMessages hide={() => setShowTemplateMessages(false)} />
      )}
    </TemplateMessagesContext.Provider>
  )
}
