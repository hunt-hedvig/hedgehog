import React, { createContext, useContext, useState } from 'react'
// import toast from 'react-hot-toast'
// import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { TemplateMessagesModal } from './components/TemplateMessagesModal'
import { Market } from '../config/constants'
import { useGetTemplateMessagesQuery, Template } from 'types/generated/graphql'

// export interface TemplateMessage {
//   language: string
//   message: string
// }

// export interface TemplateMessages {
//   id: string
//   title: string
//   messages: TemplateMessage[]
//   expirationDate: string
//   pinned: boolean
// }

interface TemplateMessagesContextProps {
  templates: Template[]
  show: () => void
  create: (template: Template) => void
  edit: (template: Template) => void
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

  // const [templates, setTemplates] = useInsecurePersistentState<
  //   TemplateMessages[]
  // >('messages:templates', [])

  const templatesQuery = useGetTemplateMessagesQuery()

  const createHandler = (template: Template) => {
    console.log(template)
    // setTemplates((prev) => [...prev, template])
    // toast.success(`Template ${template.name} successfully created`)
  }

  const editHandler = (newTemplate: Template) => {
    console.log(newTemplate)
    // setTemplates((prev) => [
    //   ...prev.filter((template) => template.id !== newTemplate.id),
    //   newTemplate,
    // ])
    // toast.success('Template updated')
  }

  const deleteHandler = (templateId: string) => {
    console.log(templateId)
    // const newTemplates = templates.filter(
    //   (template) => template.id !== templateId,
    // )
    // setTemplates(newTemplates)
    // toast.success('Template deleted')
  }

  const pinHandler = (templateId: string) => {
    console.log(templateId)
    // const template = templates.find((template) => template.id === templateId)
    // setTemplates((prev) =>
    //   prev.map((template) =>
    //     template.id !== templateId
    //       ? template
    //       : { ...template, pinned: !template.pinned },
    //   ),
    // )
    // toast.success(`Template ${template?.pinned ? 'unpinned' : 'pinned'}`)
  }

  return (
    <TemplateMessagesContext.Provider
      value={{
        templates: templatesQuery.data?.templates || [],
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
