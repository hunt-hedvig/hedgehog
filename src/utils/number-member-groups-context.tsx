import { totalNumberMemberGroups } from 'components/questions/filter'
import React, { createContext, useEffect, useState } from 'react'

const NUMBER_MEMBER_GROUPS_KEY = 'hedvig:member:groups:number'

export const getDefaultNumberMemberGroups = (): number => {
  try {
    const numberOfMemberGroups = Number(
      window.localStorage.getItem(NUMBER_MEMBER_GROUPS_KEY),
    )
    return Math.min(numberOfMemberGroups, totalNumberMemberGroups) ?? 2
  } catch (e) {
    console.error(e)
    return 2
  }
}

export const NumberMemberGroupsContext = createContext<{
  numberMemberGroups: number
  setNumberMemberGroups: (value: number) => void
}>({
  numberMemberGroups: getDefaultNumberMemberGroups(),
  setNumberMemberGroups: (_value: number) => void 0,
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
    <NumberMemberGroupsContext.Provider
      value={{
        numberMemberGroups,
        setNumberMemberGroups: (newNumberMemberGroups: number) => {
          setNumberMemberGroups(newNumberMemberGroups)
        },
      }}
    >
      {children}
    </NumberMemberGroupsContext.Provider>
  )
}
