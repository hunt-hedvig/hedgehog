import React, { createContext, useContext } from 'react'
import { Me } from 'types/generated/graphql'

interface MeContextProps {
  me: Me | null
  settings: object
}

const MeContext = createContext<MeContextProps>({ me: null, settings: {} })

export const useMe = () => useContext(MeContext)

export const MeProvider: React.FC<{ me: Me | null }> = ({ me, children }) => {
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

  return (
    <MeContext.Provider value={{ me, settings }}>{children}</MeContext.Provider>
  )
}
