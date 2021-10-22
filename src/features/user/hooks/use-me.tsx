import React, { createContext, useContext } from 'react'
import { Me as _Me } from 'types/generated/graphql'

interface PartialMe {
  email: string
  fullName: string
}

interface MeContextProps {
  me: PartialMe
  settings: object
}

interface MeProviderProps {
  me: _Me | null
}

const MeContext = createContext<MeContextProps>({} as any)

export const useMe = () => useContext(MeContext)

export const MeProvider: React.FC<MeProviderProps> = ({ me, children }) => {
  if (!me) {
    return null
  }

  const settings =
    me?.settings?.reduce((acc, setting) => {
      try {
        acc[setting.key] = JSON.parse(setting.value)
      } catch (e) {
        console.error(`User setting with key ${setting.key} is not valid JSON`)
        console.error(e)
      }
      return acc
    }, {}) ?? {}

  const partialMe = {
    email: me.user.email,
    fullName: me.user.fullName,
  }

  return (
    <MeContext.Provider value={{ me: partialMe, settings }}>
      {children}
    </MeContext.Provider>
  )
}
