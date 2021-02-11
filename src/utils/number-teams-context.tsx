import React, { createContext, useEffect, useState } from 'react'

const NUMBER_TEAMS_KEY = 'hedvig:teams:number'

export const getDefaultNumberTeams = (): number => {
  try {
    return +(window.localStorage.getItem(NUMBER_TEAMS_KEY) ?? 2)
  } catch (e) {
    console.error(e)
    return 2
  }
}

export const NumberTeamsContext = createContext({
  numberTeams: getDefaultNumberTeams(),
  setNumberTeams: (_numberTeams: number) => {
    // noop
  },
})

export const NumberTeamsProvider: React.FC = ({ children }) => {
  const [numberTeams, setNumberTeams] = useState(() => getDefaultNumberTeams())

  useEffect(() => {
    localStorage.setItem(NUMBER_TEAMS_KEY, numberTeams.toString())
  }, [numberTeams])

  return (
    <NumberTeamsContext.Provider
      value={{
        numberTeams,
        setNumberTeams: (newNumberTeams: number) => {
          setNumberTeams(newNumberTeams)
        },
      }}
    >
      {children}
    </NumberTeamsContext.Provider>
  )
}
