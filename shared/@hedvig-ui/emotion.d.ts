import '@emotion/react'
import { lightTheme } from '@hedvig-ui/index'

declare module '@emotion/react' {
  type ThemeRecord = Record<keyof typeof lightTheme, string>

  // eslint-disable-next-line
  export interface Theme extends ThemeRecord {}
}