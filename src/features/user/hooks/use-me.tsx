import React, { createContext, useContext } from 'react'
import { Me } from 'types/generated/graphql'

interface MeContextProps {
  me: Me | null
}

const MeContext = createContext<MeContextProps>({ me: null })

export const useMe = () => useContext(MeContext)

export const MeProvider: React.FC<{ me: Me | null }> = ({ me, children }) => {
  return <MeContext.Provider value={{ me }}>{children}</MeContext.Provider>
}
