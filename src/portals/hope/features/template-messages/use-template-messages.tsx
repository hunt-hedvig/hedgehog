import React, { createContext, useContext, useEffect, useState } from 'react'
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
  GetTemplatesDocument,
  GetTemplatesQuery,
} from 'types/generated/graphql'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'
import { useActionsHistory } from '../history/use-actions-history'

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

export const formatLocale = (locale: PickedLocale, isEn?: boolean) =>
  isEn ? locale.split('_')[0].toUpperCase() : locale.split('_')[1].toUpperCase()

export const uniquePickedLocales: PickedLocale[] = Object.values(
  PickedLocale,
).filter(
  (locale) =>
    locale !== PickedLocale.EnDk &&
    locale !== PickedLocale.EnNo &&
    locale !== PickedLocale.EnSe,
)

export interface LocaleDisplayed {
  isEnglishLocale: boolean
  memberId?: string
}

interface TemplateMessagesContextProps {
  templates: Template[]
  show: () => void
  create: (template: UpsertTemplateInput, actionOnSuccess?: () => void) => void
  edit: (template: Template) => void
  delete: (id: string) => void
  pin: (id: string) => void
  select: (text: string) => void
  selected: string | null
  locale: PickedLocale
  setLocale: (locale: PickedLocale) => void
  memberId?: string
  setMemberId: (id: string) => void
  currentLocaleDisplayed: LocaleDisplayed | null
  changeLocaleDisplayed: (memberId: string, isEnglish?: boolean) => void
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
  memberId: '',
  setMemberId: () => void 0,
  currentLocaleDisplayed: null,
  changeLocaleDisplayed: () => void 0,
  loading: false,
})

export const useTemplateMessages = () => useContext(TemplateMessagesContext)

export const TemplateMessagesProvider: React.FC = ({ children }) => {
  const [memberId, setMemberId] = useState<string>()
  const [locale, setLocale] = useState<PickedLocale>(PickedLocale.SvSe)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [showTemplateMessages, setShowTemplateMessages] = useState(false)

  const [localesDisplayed, setLocalesDisplayed] = useInsecurePersistentState<
    LocaleDisplayed[]
  >('templates:member:language', [])

  const { data } = useGetTemplatesQuery({
    variables: {
      locales: [formatLocale(locale)],
    },
  })

  const [upsertTemplate, { loading }] = useUpsertTemplateMutation()
  const [togglePinStatus] = useTogglePinStatusMutation()
  const [removeTemplate] = useRemoveTemplateMutation()

  const { registerAction } = useActionsHistory()

  const templates = data?.templates ?? []

  useEffect(() => {
    if (
      memberId &&
      !localesDisplayed?.find((locale) => locale.memberId === memberId)
    ) {
      setLocalesDisplayed((prev) => [
        ...prev,
        {
          isEnglishLocale: false,
          memberId,
        },
      ])
    }
  }, [memberId])

  const createHandler = (
    newTemplate: UpsertTemplateInput,
    actionOnSuccess?: () => void,
  ) => {
    const template: Template = {
      id: 'temp-id',
      title: newTemplate.title,
      expirationDate: newTemplate.expirationDate,
      messages: newTemplate.messages,
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
        },
        optimisticResponse: {
          upsertTemplate: { __typename: 'Template', ...template },
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
              (message) =>
                message.language !== formatLocale(PickedLocale.EnSe, true),
            )
            .map((message) => message.language)
            .forEach((language) => {
              const cachedData = cache.readQuery({
                query: GetTemplatesDocument,
                variables: {
                  locales: [language],
                },
              }) as GetTemplatesQuery

              const cachedTemplates =
                (cachedData as GetTemplatesQuery)?.templates.filter(
                  (temp) => temp.id !== response.upsertTemplate.id,
                ) ?? []

              cache.writeQuery({
                query: GetTemplatesDocument,
                data: {
                  templates: [...cachedTemplates, response.upsertTemplate],
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
        success: () => {
          actionOnSuccess?.()
          PushUserAction('template', 'created', null, null)
          return 'Template created'
        },
        error: (err) => {
          if (err.toString().includes('already exists')) {
            const splittedError = err.toString().split(': ')
            return splittedError[splittedError.length - 1]
          }

          return 'Could not create template'
        },
      },
    )
  }

  const editHandler = (newTemplate: Template) => {
    const oldTemplate = templates.find((templ) => templ.id === newTemplate.id)

    if (!oldTemplate) {
      return
    }

    const template: Template = {
      id: newTemplate.id,
      title: newTemplate.title,
      expirationDate: newTemplate.expirationDate,
      messages: newTemplate.messages,
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
        },
        optimisticResponse: {
          upsertTemplate: { __typename: 'Template', ...template },
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
              (message) =>
                message.language !== formatLocale(PickedLocale.EnSe, true),
            )
            .map((message) => message.language)
            .forEach((language) => {
              const cachedData = cache.readQuery({
                query: GetTemplatesDocument,
                variables: {
                  locales: [language],
                },
              }) as GetTemplatesQuery

              const cachedTemplates =
                (cachedData as GetTemplatesQuery)?.templates ?? []

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
        success: () => {
          PushUserAction('template', 'updated', null, null)
          registerAction(() => {
            const revertTemplate: Template = {
              id: oldTemplate.id,
              title: oldTemplate.title,
              messages: oldTemplate.messages.map((message) => ({
                language: message.language,
                message: message.message,
              })),
              pinned: oldTemplate.pinned,
              expirationDate: oldTemplate.expirationDate,
            }

            editHandler(revertTemplate)
          }, `Update template - ${oldTemplate.title}`)
          return 'Template updated'
        },
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
              (message) =>
                message.language !== formatLocale(PickedLocale.EnSe, true),
            )
            .map((message) => message.language)
            .forEach((language) => {
              const cachedData = cache.readQuery({
                query: GetTemplatesDocument,
                variables: {
                  locales: [language],
                },
              })

              if (cachedData) {
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
              }
            })
        },
      }),
      {
        loading: 'Deleting template',
        success: () => {
          PushUserAction('template', 'deleted', null, null)
          registerAction(() => {
            const template: UpsertTemplateInput = {
              id: deletingTemplate.id,
              title: deletingTemplate.title,
              messages: deletingTemplate.messages.map((message) => ({
                language: message.language,
                message: message.message,
              })),
            }

            createHandler(template)
          }, `Delete template - ${deletingTemplate.title}`)
          return 'Template deleted'
        },
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
          update: (
            cache: ApolloCache<NormalizedCacheObject>,
            { data: response },
          ) => {
            if (!response?.togglePinStatus) {
              return
            }

            changedTemplate.messages
              .filter(
                (message) =>
                  message.language !== formatLocale(PickedLocale.EnSe, true),
              )
              .map((message) => message.language)
              .forEach((language) => {
                const cachedData = cache.readQuery({
                  query: GetTemplatesDocument,
                  variables: {
                    locales: [language],
                  },
                }) as GetTemplatesQuery

                const cachedTemplates =
                  (cachedData as GetTemplatesQuery)?.templates ?? []

                cache.writeQuery({
                  query: GetTemplatesDocument,
                  data: {
                    templates: [
                      ...cachedTemplates.filter(
                        (temp) => temp.id !== changedTemplate.id,
                      ),
                      {
                        ...changedTemplate,
                        pinned: !changedTemplate.pinned,
                      },
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
          loading: 'Pinning template',
          success: (response) => {
            PushUserAction('template', 'pinned', null, null)

            const status = response.data?.togglePinStatus.pinned
              ? 'pinned'
              : 'unpinned'

            return 'Template ' + status
          },
          error: 'Could not pin template',
        },
      )
    }
  }

  const changeLocaleDisplayed = (memberId: string, isEnglish?: boolean) => {
    setLocalesDisplayed((prev) =>
      prev.map((locale) => {
        if (locale.memberId === memberId) {
          return {
            ...locale,
            isEnglishLocale: isEnglish || !locale.isEnglishLocale,
          }
        }

        return locale
      }),
    )
  }

  return (
    <TemplateMessagesContext.Provider
      value={{
        templates: [...templates].sort((a, b) => {
          if (a.title < b.title) {
            return -1
          }
          if (a.title > b.title) {
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
        locale,
        setLocale: (newLocale: PickedLocale) => setLocale(newLocale),
        memberId,
        setMemberId,
        currentLocaleDisplayed:
          localesDisplayed?.find((locale) => locale.memberId === memberId) ||
          null,
        changeLocaleDisplayed,
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
