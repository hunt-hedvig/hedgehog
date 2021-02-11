import React, { createContext, useEffect, useState } from 'react'

const NUMBER_COLORS_KEY = 'hedvig:teams:number'

export const getDefaultNumberColors = (): number => {
  try {
    return +(window.localStorage.getItem(NUMBER_COLORS_KEY) ?? 2)
  } catch (e) {
    console.error(e)
    return 2
  }
}

export const NumberColorsContext = createContext({
  numberColors: getDefaultNumberColors(),
  setNumberColors: (_numberColors: number) => {
    // noop
  },
})

export const NumberColorsProvider: React.FC = ({ children }) => {
  const [numberColors, setNumberColors] = useState(() =>
    getDefaultNumberColors(),
  )

  useEffect(() => {
    localStorage.setItem(NUMBER_COLORS_KEY, numberColors.toString())
  }, [numberColors])

  return (
    <NumberColorsContext.Provider
      value={{
        numberColors,
        setNumberColors: (newNumberColors: number) => {
          setNumberColors(newNumberColors)
        },
      }}
    >
      {children}
    </NumberColorsContext.Provider>
  )
}
