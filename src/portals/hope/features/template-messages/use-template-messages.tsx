import React, { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { TemplateMessagesModal } from './components/TemplateMessagesModal'
import { Market } from '../config/constants'

export interface TemplateMessage {
  market: Market
  text: string
}

export interface TemplateMessages {
  name: string
  id: string
  market: Market[]
  messages: TemplateMessage[]
  messageEn: string
  expiryDate: string | null
  pinned?: boolean
}

interface TemplateMessagesContextProps {
  templates: TemplateMessages[]
  show: () => void
  create: (template: TemplateMessages) => void
  edit: (template: TemplateMessages) => void
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
    TemplateMessages[]
  >('messages:templates', [])

  const createHandler = (template: TemplateMessages) => {
    setTemplates((prev) => [...prev, template])

    toast.success(`Template ${template.name} successfully created`)
  }

  const editHandler = (newTemplate: TemplateMessages) => {
    setTemplates((prev) => [
      ...prev.filter((template) => template.id !== newTemplate.id),
      newTemplate,
    ])

    toast.success('Template updated')
  }

  const deleteHandler = (templateId: string) => {
    const newTemplates = templates.filter(
      (template) => template.id !== templateId,
    )
    setTemplates(newTemplates)

    toast.success('Template deleted')
  }

  const pinHandler = (templateId: string) => {
    const template = templates.find((template) => template.id === templateId)

    setTemplates((prev) =>
      prev.map((template) =>
        template.id !== templateId
          ? template
          : { ...template, pinned: !template.pinned },
      ),
    )

    toast.success(`Template ${template?.pinned ? 'unpinned' : 'pinned'}`)
  }

  return (
    <TemplateMessagesContext.Provider
      value={{
        templates: templates.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1
          }
          return 0
        }),
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
        <TemplateMessagesModal hide={() => setShowTemplateMessages(false)} />
      )}
    </TemplateMessagesContext.Provider>
  )
}
