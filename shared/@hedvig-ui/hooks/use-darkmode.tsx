import React, { createContext, useContext, useState } from 'react'
import { ThemeProvider } from '@emotion/react'
import { darkTheme, lightTheme } from '@hedvig-ui'

export const getDefaultIsDarkmode = () =>
  window.localStorage.getItem('hedvig:theming:darkmode') === 'true'

export const UseDarkmode = createContext({
  isDarkmode: getDefaultIsDarkmode(),
  setIsDarkmode: (_: boolean) => {
    /* noop */
  },
})

export const useDarkmode = () => useContext(UseDarkmode)

export const DarkmodeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkmode, setIsDarkmode] = useState(getDefaultIsDarkmode())

  return (
    <UseDarkmode.Provider
      value={{
        isDarkmode,
        setIsDarkmode: (newIsDarkmode) => {
          setIsDarkmode(newIsDarkmode)
          localStorage.setItem(
            'hedvig:theming:darkmode',
            JSON.stringify(newIsDarkmode),
          )
        },
      }}
    >
      <ThemeProvider theme={isDarkmode ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </UseDarkmode.Provider>
  )
}
