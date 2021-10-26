import { FetchResult } from '@apollo/client'
import React, { createContext, useContext } from 'react'
import {
  GetMeDocument,
  GetMeQuery,
  Me as _Me,
  UserSettingKey,
  useUpdateUserSettingsMutation,
} from 'types/generated/graphql'

interface PartialMe {
  email: string
  fullName: string
}

interface MeContextProps {
  me: PartialMe
  settings: object
  updateSetting: (key: UserSettingKey, value: object) => Promise<FetchResult>
}

interface MeProviderProps {
  me: _Me | null
}

const MeContext = createContext<MeContextProps>({} as any)

export const useMe = () => useContext(MeContext)

export const MeProvider: React.FC<MeProviderProps> = ({ me, children }) => {
  const [upsertUserSettings] = useUpdateUserSettingsMutation()

  if (!me) {
    return null
  }

  const [settings, setSettings] = React.useState(
    me.settings.reduce((acc, setting) => {
      try {
        acc[setting.key] = JSON.parse(setting.value)
      } catch (e) {
        console.error(`User setting with key ${setting.key} is not valid JSON`)
        console.error(e)
      }
      return acc
    }, {}) ?? {},
  )

  const partialMe = {
    email: me.user.email,
    fullName: me.user.fullName,
  }

  const updateSetting = (
    key: UserSettingKey,
    value: object,
  ): Promise<FetchResult> => {
    const payload = JSON.stringify(value)
    setSettings((prev) => ({ ...prev, [key]: value }))

    return upsertUserSettings({
      variables: { settings: [{ key, value: payload }] },
      update: (cache, { data: response }) => {
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
