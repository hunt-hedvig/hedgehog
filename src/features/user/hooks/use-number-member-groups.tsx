import { totalNumberMemberGroups } from 'features/questions/FilterSelect'
import React, { createContext, useContext, useEffect, useState } from 'react'

const NUMBER_MEMBER_GROUPS_KEY = 'hedvig:member:groups:number'

export const getDefaultNumberMemberGroups = (): number => {
  try {
    const numberOfMemberGroups = Number(
      window.localStorage.getItem(NUMBER_MEMBER_GROUPS_KEY) ?? 2,
    )
    return Math.min(numberOfMemberGroups, totalNumberMemberGroups)
  } catch (e) {
    console.error(e)
    return 2
  }
}

const UseNumberMemberGroups = createContext<{
  numberMemberGroups: number
  setNumberMemberGroups: (value: number) => void
}>({
  numberMemberGroups: getDefaultNumberMemberGroups(),
  setNumberMemberGroups: (_value: number) => undefined,
})

export const NumberMemberGroupsProvider: React.FC = ({ children }) => {
  const [numberMemberGroups, setNumberMemberGroups] = useState<number>(() =>
    getDefaultNumberMemberGroups(),
  )

  useEffect(() => {
    localStorage.setItem(
      NUMBER_MEMBER_GROUPS_KEY,
      numberMemberGroups.toString(),
    )
  }, [numberMemberGroups])

  return (
    <UseNumberMemberGroups.Provider
      value={{
        numberMemberGroups,
        setNumberMemberGroups,
      }}
    >
      {children}
    </UseNumberMemberGroups.Provider>
  )
}

export const useNumberMemberGroups = () => useContext(UseNumberMemberGroups)
