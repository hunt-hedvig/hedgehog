import React, { createContext, useContext, useState } from 'react'
import gql from 'graphql-tag'
import toast from 'react-hot-toast'
import { TemplateMessagesModal } from './components/TemplateMessagesModal'
import { PickedLocale } from '../config/constants'
import {
  useGetTemplatesQuery,
  Template,
  useUpsertTemplateMutation,
  useRemoveTemplateMutation,
  useTogglePinStatusMutation,
  UpsertTemplateInput,
  TemplateMessage,
  GetTemplatesDocument,
  GetTemplatesQuery,
} from 'types/generated/graphql'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'

gql`
  query GetTemplates($locales: [String!]!) {
    templates(locales: $locales) {
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

  mutation UpsertTemplate($input: UpsertTemplateInput!, $locale: String!) {
    upsertTemplate(input: $input, locale: $locale) {
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

export const formatLocale = (locale: PickedLocale) =>
  locale.split('_')[0].toUpperCase()

interface TemplateMessagesContextProps {
  templates: Template[]
  show: () => void
  create: (template: UpsertTemplateInput) => void
  edit: (template: Template) => void
  delete: (id: string) => void
  pin: (id: string) => void
  select: (text: string) => void
  selected: string | null
  locale: PickedLocale
  setLocale: (locale: PickedLocale) => void
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
  locale: PickedLocale.SvSe,
  setLocale: () => void 0,
  loading: false,
})

export const useTemplateMessages = () => useContext(TemplateMessagesContext)

export const TemplateMessagesProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = useState<PickedLocale>(PickedLocale.SvSe)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [showTemplateMessages, setShowTemplateMessages] = useState(false)

  const { data } = useGetTemplatesQuery({
    variables: {
      locales: [formatLocale(locale)],
    },
  })

  const [upsertTemplate, { loading }] = useUpsertTemplateMutation()
  const [togglePinStatus] = useTogglePinStatusMutation()
  const [removeTemplate] = useRemoveTemplateMutation()

  const templates = data?.templates ?? []

  const getFormattedMessages = (
    messages: TemplateMessage[],
  ): TemplateMessage[] =>
    messages.map((message) => ({
      ...message,
      language: formatLocale(message.language as PickedLocale),
    }))

  const createHandler = (newTemplate: UpsertTemplateInput) => {
    const template: Template = {
      id: 'temp-id',
      title: newTemplate.title,
      expirationDate: newTemplate.expirationDate,
      messages: getFormattedMessages(newTemplate.messages),
      pinned: false,
    }

    toast.promise(
      upsertTemplate({
        variables: {
          input: {
            title: template.title,
            expirationDate: template.expirationDate,
            messages: template.messages,
          },
          locale: formatLocale(locale),
        },
        optimisticResponse: {
          upsertTemplate: [
            ...templates,
            { __typename: 'Template', ...template },
          ],
        },
        update: (
          cache: ApolloCache<NormalizedCacheObject>,
          { data: response },
        ) => {
          if (!response?.upsertTemplate) {
            return
          }

          template.messages
            .filter(
              (message) => message.language !== formatLocale(PickedLocale.EnSe),
            )
            .map((message) => message.language)
            .forEach((language) => {
              const cachedData = cache.readQuery({
                query: GetTemplatesDocument,
                variables: {
                  locales: [language],
                },
              }) as GetTemplatesQuery

              const cachedTemplates = (cachedData as GetTemplatesQuery)
                .templates

              cache.writeQuery({
                query: GetTemplatesDocument,
                data: {
                  templates: [...cachedTemplates, template],
                },
                variables: {
                  locales: [language],
                },
              })
            })
        },
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
      messages: getFormattedMessages(newTemplate.messages),
      pinned: newTemplate.pinned,
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
          locale: formatLocale(locale),
        },
        optimisticResponse: {
          upsertTemplate: [
            ...templates.filter((temp) => temp.id !== template.id),
            { __typename: 'Template', ...template },
          ],
        },
        update: (
          cache: ApolloCache<NormalizedCacheObject>,
          { data: response },
        ) => {
          if (!response?.upsertTemplate) {
            return
          }

          template.messages
            .filter(
              (message) => message.language !== formatLocale(PickedLocale.EnSe),
            )
            .map((message) => message.language)
            .forEach((language) => {
              const cachedData = cache.readQuery({
                query: GetTemplatesDocument,
                variables: {
                  locales: [language],
                },
              }) as GetTemplatesQuery

              const cachedTemplates = (cachedData as GetTemplatesQuery)
                .templates

              cache.writeQuery({
                query: GetTemplatesDocument,
                data: {
                  templates: [
                    ...cachedTemplates.filter(
                      (temp) => temp.id !== template.id,
                    ),
                    template,
                  ],
                },
                variables: {
                  locales: [language],
                },
              })
            })
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
    const deletingTemplate = templates.find(
      (template) => template.id === templateId,
    )

    if (!deletingTemplate) {
      return
    }

    toast.promise(
      removeTemplate({
        variables: {
          templateId,
        },
        optimisticResponse: {
          removeTemplate: true,
        },
        update: (
          cache: ApolloCache<NormalizedCacheObject>,
          { data: response },
        ) => {
          if (!response) {
            return
          }

          deletingTemplate.messages
            .filter(
              (message) => message.language !== formatLocale(PickedLocale.EnSe),
            )
            .map((message) => message.language)
            .forEach((language) => {
              const cachedData = cache.readQuery({
                query: GetTemplatesDocument,
                variables: {
                  locales: [language],
                },
              })

              const cachedTemplates = (cachedData as GetTemplatesQuery)
                .templates

              cache.writeQuery({
                query: GetTemplatesDocument,
                data: {
                  templates: cachedTemplates.filter(
                    (template) => template.id !== templateId,
                  ),
                },
                variables: {
                  locales: [language],
                },
              })
            })
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
    const changedTemplate: Template | undefined = templates.find(
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
              id: templateId,
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
        templates,
        show: () => setShowTemplateMessages(true),
        create: createHandler,
        edit: editHandler,
        delete: deleteHandler,
        pin: pinHandler,
        select: (text: string) => setSelectedText(text),
        selected: selectedText,
        locale,
        setLocale: (newLocale: PickedLocale) => setLocale(newLocale),
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
