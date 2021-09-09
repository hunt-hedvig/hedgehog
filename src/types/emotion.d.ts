import '@emotion/react'
import { lightTheme } from '@hedvig-ui'

declare module '@emotion/react' {
  type ThemeRecord = Record<keyof typeof lightTheme, string>

  // tslint:disable-next-line
  export interface Theme extends ThemeRecord {}
}
