import { createContext } from 'react'

export const getDefaultIsDarkmode = () =>
  window.localStorage.getItem('hedvig:theming:darkmode') === 'true'

export const DarkmodeContext = createContext({
  isDarkmode: getDefaultIsDarkmode(),
  setIsDarkmode: (_isDarkmode: boolean) => {
    /* noop */
  },
})
