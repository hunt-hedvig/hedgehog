import React, { createContext, useContext, useState } from 'react'
import gql from 'graphql-tag'
import toast from 'react-hot-toast'
// import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { TemplateMessagesModal } from './components/TemplateMessagesModal'
import { Market } from '../config/constants'
import {
  useGetTemplatesQuery,
  Template,
  TemplateMessage,
  useUpsertTemplateMutation,
  useRemoveTemplateMutation,
  useTogglePinStatusMutation,
  UpsertTemplateInput,
} from 'types/generated/graphql'

gql`
  query GetTemplates {
    templates {
      id
      title
      messages {
        language
        message
      }
      expirationDate
      pinned
    }
  }

  query GetTemplateById($templateId: ID!) {
    template(id: $templateId) {
      id
      title
      messages {
        language
        message
      }
      expirationDate
      pinned
    }
  }

  mutation TogglePinStatus($templateId: ID!) {
    togglePinStatus(id: $templateId) {
      id
      pinned
    }
  }

  mutation UpsertTemplate($input: UpsertTemplateInput!) {
    upsertTemplate(input: $input) {
      id
      title
      messages {
        language
        message
      }
      expirationDate
      pinned
    }
  }

  mutation RemoveTemplate($templateId: ID!) {
    removeTemplate(id: $templateId)
  }
`

export enum Language {
  SWEDEN = 'SE',
  NORWAY = 'NO',
  DENMARK = 'DK',
  ENGLISH = 'EN',
}

interface TemplateMessagesContextProps {
  templates: Template[]
  show: () => void
  create: (template: UpsertTemplateInput) => void
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

  const templatesQuery = useGetTemplatesQuery()
  const [upsertTemplate, { loading }] = useUpsertTemplateMutation()
  const [togglePinStatus] = useTogglePinStatusMutation()

  const [removeTemplate] = useRemoveTemplateMutation()

  const getTemplateMessages = (
    messages: TemplateMessage[],
  ): TemplateMessage[] =>
    messages.map((msg) => ({
      ...msg,
      language: Language[msg.language as Market],
    }))

  const createHandler = (template: UpsertTemplateInput) => {
    const newTemplate: UpsertTemplateInput = {
      title: template.title,
      expirationDate: template.expirationDate,
      messages: getTemplateMessages(template.messages),
    }

    toast.promise(
      upsertTemplate({
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
    const template: Template = {
      id: newTemplate.id,
      title: newTemplate.title,
      expirationDate: newTemplate.expirationDate,
      messages: getTemplateMessages(newTemplate.messages),
      pinned: !newTemplate.pinned,
    }

    toast.promise(
      upsertTemplate({
        variables: {
          input: {
            id: template.id,
            title: template.title,
            expirationDate: template.expirationDate,
            messages: template.messages,
          },
        },
        optimisticResponse: {
          upsertTemplate: {
            __typename: 'Template',
            ...template,
          },
        },
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
      removeTemplate({
        variables: {
          templateId,
        },
        optimisticResponse: {
          removeTemplate: true,
        },
      }),
      {
        loading: 'Deleting template',
        success: 'Template deleted',
        error: 'Could not delete template',
      },
    )
  }

  const pinHandler = (templateId: string) => {
    const changedTemplate: Template | undefined =
      templatesQuery.data?.templates.find(
        (template) => template.id === templateId,
      )

    if (changedTemplate) {
      toast.promise(
        togglePinStatus({
          variables: {
            templateId,
          },
          optimisticResponse: {
            togglePinStatus: {
              __typename: 'Template',
              ...changedTemplate,
              pinned: !changedTemplate.pinned,
            },
          },
        }),
        {
          loading: 'Pinning template',
          success: 'Template pinned',
          error: 'Could not pin template',
        },
      )
    }
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
