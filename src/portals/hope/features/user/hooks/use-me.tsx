import { ApolloCache, FetchResult, NormalizedCacheObject } from '@apollo/client'
import React, { createContext, useContext } from 'react'
import {
  GetMeDocument,
  GetMeQuery,
  Me as _Me,
  UserNotification,
  UserSettingKey,
  UserSettings,
  useUpdateUserSettingsMutation,
} from 'types/generated/graphql'

interface PartialMe {
  email: string
  fullName: string
  notifications: UserNotification[]
}

interface MeContextProps {
  me: PartialMe
  // eslint-disable-next-line
  settings: UserSettings
  updateSetting: (key: UserSettingKey, value?: unknown) => Promise<FetchResult>
}

interface MeProviderProps {
  me: _Me | null
}

const MeContext = createContext<MeContextProps>({} as unknown as MeContextProps)

export const useMe = () => useContext(MeContext)

export const MeProvider: React.FC<MeProviderProps> = ({ me, children }) => {
  const [upsertUserSettings] = useUpdateUserSettingsMutation()

  if (!me) {
    return null
  }

  const settings = me.settings

  const partialMe = {
    email: me.user.email,
    fullName: me.user.fullName,
    notifications: me.user.notifications,
  }

  const updateSetting = (
    key: UserSettingKey,
    value?: unknown,
  ): Promise<FetchResult> => {
    return upsertUserSettings({
      variables: { settings: [{ key, value }] },
      optimisticResponse: {
        upsertUserSettings: {
          ...me.settings,
          [key]: value,
        },
      },
      update: (
        cache: ApolloCache<NormalizedCacheObject>,
        { data: response },
      ) => {
        if (!response?.upsertUserSettings) {
          return
        }

        const cachedData = cache.readQuery({
          query: GetMeDocument,
        }) as GetMeQuery

        cache.writeQuery({
          query: GetMeDocument,
          data: {
            me: {
              ...cachedData.me,
              settings: response.upsertUserSettings,
            },
          },
        })
      },
    })
  }

  return (
    <MeContext.Provider value={{ me: partialMe, settings, updateSetting }}>
      {children}
    </MeContext.Provider>
  )
}
