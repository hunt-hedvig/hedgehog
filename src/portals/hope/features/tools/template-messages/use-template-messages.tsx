import React, { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { TemplateMessages } from './components/TemplateMessages'
import { Market } from '../../config/constants'

export interface Message {
  market: Market
  text: string
}

export interface TemplateMessage {
  name: string
  id: string
  market: Market[]
  messages: Message[]
  messageEn: string
  expiryDate: string | null
  pinned?: boolean
}

interface TemplateMessagesContextProps {
  templates: TemplateMessage[]
  show: () => void
  create: (template: TemplateMessage) => void
  edit: (template: TemplateMessage) => void
  delete: (id: string) => void
  pin: (id: string) => void
  select: (text: string) => void
  selected: string | null
  market: Market
  setMarket: (market: Market) => void
}

const TemplateMessagesContext = createContext<TemplateMessagesContextProps>({
  templates: [],
  show: () => void 0,
  create: () => void 0,
  edit: () => void 0,
  delete: () => void 0,
  pin: () => void 0,
  select: () => void 0,
  selected: null,
  market: Market.Sweden,
  setMarket: () => void 0,
})

export const useTemplateMessages = () => useContext(TemplateMessagesContext)

export const TemplateMessagesProvider: React.FC = ({ children }) => {
  const [market, setMarket] = useState<Market>(Market.Sweden)
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
    setTemplates((prev) => [
      ...prev.filter((template) => template.id !== newTemplate.id),
      newTemplate,
    ])

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

  return (
    <TemplateMessagesContext.Provider
      value={{
        templates,
        show: () => setShowTemplateMessages(true),
        create: createHandler,
        edit: editHandler,
        delete: deleteHandler,
        pin: pinHandler,
        select: (text: string) => setSelectedText(text),
        selected: selectedText,
        market,
        setMarket: (market: Market) => setMarket(market),
      }}
    >
      {children}
      {showTemplateMessages && (
        <TemplateMessages hide={() => setShowTemplateMessages(false)} />
      )}
    </TemplateMessagesContext.Provider>
  )
}
