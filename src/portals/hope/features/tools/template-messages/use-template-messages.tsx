import React, { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { TemplateMessages } from './components/TemplateMessages'

export enum Markets {
  Sweden = 'SWEDEN',
  Denmark = 'DENMARK',
  Norway = 'NORWAY',
}

export interface TemplateMessage {
  name: string
  id: string
  market: Markets
  message: string
  messageEn: string
  withExpiry?: boolean
  expiryDate?: string | null
  pinned?: boolean
}

interface TemplateMessagesContextProps {
  show: () => void
  createTemplate: (template: TemplateMessage) => void
  editTemplate: (template: TemplateMessage) => void
  deleteTemplate: (id: string) => void
  pinTemplate: (id: string) => void
  select: (text: string) => void
  selected: string | null
  currentMarket: Markets
  changeCurrentMarket: (market: Markets) => void
}

const TemplateMessagesContext = createContext<TemplateMessagesContextProps>({
  show: () => void 0,
  createTemplate: () => void 0,
  editTemplate: () => void 0,
  deleteTemplate: () => void 0,
  pinTemplate: () => void 0,
  select: () => void 0,
  selected: null,
  currentMarket: Markets.Sweden,
  changeCurrentMarket: () => void 0,
})

export const useTemplateMessages = () => useContext(TemplateMessagesContext)

export const TemplateMessagesProvider: React.FC = ({ children }) => {
  const [currentMarket, setCurrentMarket] = useState<Markets>(Markets.Sweden)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [showTemplateMessages, setShowTemplateMessages] = useState(false)

  const createHandler = (template: TemplateMessage) => {
    const allTemplates = localStorage.getItem('hedvig:messages:templates')

    if (!allTemplates) {
      localStorage.setItem(
        'hedvig:messages:templates',
        JSON.stringify([template]),
      )

      toast.success(`Template ${template.name} successfully created`)

      return
    }

    const newTemplates = [...JSON.parse(allTemplates), template]
    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify(newTemplates),
    )

    toast.success(`Template ${template.name} successfully created`)
  }

  const editHandler = (newTemplate: TemplateMessage) => {
    const allTemplates = localStorage.getItem('hedvig:messages:templates')

    if (!allTemplates) {
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

    toast.success('Template successfully edited')
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

  const changeCurrentMarket = (market: Markets) => setCurrentMarket(market)

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
