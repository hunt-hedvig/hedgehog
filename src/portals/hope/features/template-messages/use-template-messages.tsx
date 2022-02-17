import React, { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
// import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { TemplateMessagesModal } from './components/TemplateMessagesModal'
import { Market } from '../config/constants'
import {
  useGetTemplateMessagesQuery,
  Template,
  useUpsertTemplateMessageMutation,
  useRemoveTemplateMessageMutation,
  useTogglePinStatusMutation,
} from 'types/generated/graphql'

export enum Language {
  SWEDEN = 'SE',
  NORWAY = 'NO',
  DENMARK = 'DK',
  ENGLISH = 'EN',
}

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
  loading: boolean
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
  loading: false,
})

export const useTemplateMessages = () => useContext(TemplateMessagesContext)

export const TemplateMessagesProvider: React.FC = ({ children }) => {
  const [market, setMarket] = useState<Market>(Market.Sweden)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [showTemplateMessages, setShowTemplateMessages] = useState(false)

  const templatesQuery = useGetTemplateMessagesQuery()
  const [upsertTemplateMessage, { loading }] =
    useUpsertTemplateMessageMutation()
  const [pinTemplateMessage] = useTogglePinStatusMutation()

  const [removeTemplateMessage] = useRemoveTemplateMessageMutation()

  const createHandler = (template: Template) => {
    const newTemplate = {
      id: template.id,
      title: template.title,
      expirationDate: template.expirationDate,
      messages: template.messages.map((msg) => ({
        ...msg,
        language: Language[msg.language as Market],
      })),
    }

    toast.promise(
      upsertTemplateMessage({
        variables: {
          input: newTemplate,
        },
        refetchQueries: () => ['GetTemplateMessages'],
      }),
      {
        loading: 'Creating template',
        success: 'Template created',
        error: 'Could not create template',
      },
    )
  }

  const editHandler = (newTemplate: Template) => {
    const template = {
      id: newTemplate.id,
      title: newTemplate.title,
      expirationDate: newTemplate.expirationDate,
      messages: newTemplate.messages.map((msg) => ({
        ...msg,
        language: Language[msg.language as Market],
      })),
    }

    toast.promise(
      upsertTemplateMessage({
        variables: {
          input: template,
        },
        refetchQueries: () => ['GetTemplateMessages'],
      }),
      {
        loading: 'Updating template',
        success: 'Template updated',
        error: 'Could not update template',
      },
    )
  }

  const deleteHandler = (templateId: string) => {
    toast.promise(
      removeTemplateMessage({
        variables: {
          templateId,
        },
        refetchQueries: () => ['GetTemplateMessages'],
      }),
      {
        loading: 'Deleting template',
        success: 'Template deleted',
        error: 'Could not delete template',
      },
    )
  }

  const pinHandler = (templateId: string) => {
    toast.promise(
      pinTemplateMessage({
        variables: {
          templateId,
        },
        refetchQueries: () => ['GetTemplateMessages'],
      }),
      {
        loading: 'Pinning template',
        success: 'Template pinned',
        error: 'Could not pin template',
      },
    )
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
        loading,
      }}
    >
      {children}
      {showTemplateMessages && (
        <TemplateMessagesModal hide={() => setShowTemplateMessages(false)} />
      )}
    </TemplateMessagesContext.Provider>
  )
}
