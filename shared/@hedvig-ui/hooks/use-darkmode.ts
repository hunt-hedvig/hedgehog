import { createContext, useContext } from 'react'

export const getDefaultIsDarkmode = () =>
  window.localStorage.getItem('hedvig:theming:darkmode') === 'true'

export const UseDarkmode = createContext({
  isDarkmode: getDefaultIsDarkmode(),
  setIsDarkmode: (_isDarkmode: boolean) => {
    /* noop */
  },
})

export const useDarkmode = () => useContext(UseDarkmode)
