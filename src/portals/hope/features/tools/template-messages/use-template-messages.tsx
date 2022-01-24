import React, { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { TemplateMessages } from './components/TemplateMessages'

export enum Markets {
  Sweden = 'SWEDEN',
  Denmark = 'DENMARK',
  Norway = 'NORWAY',
}

export interface Message {
  market: Markets
  text: string
}

export interface TemplateMessage {
  name: string
  id: string
  markets: Markets[]
  messages: Message[]
  messageEn: string
  withExpiry?: boolean
  expiryDate?: string | null
  pinned?: boolean
}

interface TemplateMessagesContextProps {
  templates: TemplateMessage[]
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
  templates: [],
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
  const [templates, setTemplates] = useInsecurePersistentState<
    TemplateMessage[]
  >('messages:templates', [])

  const createHandler = (template: TemplateMessage) => {
    setTemplates((prev) => [...prev, template])

    toast.success(`Template ${template.name} successfully created`)
  }

  const editHandler = (newTemplate: TemplateMessage) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id !== newTemplate.id ? template : newTemplate,
      ),
    )

    toast.success('Template successfully edited')
  }

  const deleteHandler = (templateId: string) => {
    const newTemplates = templates.filter(
      (template) => template.id !== templateId,
    )
    setTemplates(newTemplates)

    toast.success('Template successfully deleted')
  }

  const pinHandler = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id !== templateId
          ? template
          : { ...template, pinned: !template.pinned },
      ),
    )

    toast.success('Template successfully pinned')
  }

  const changeCurrentMarket = (market: Markets) => setCurrentMarket(market)

  return (
    <TemplateMessagesContext.Provider
      value={{
        templates,
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
