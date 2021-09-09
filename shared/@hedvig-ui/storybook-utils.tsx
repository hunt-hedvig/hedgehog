import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { darkTheme, lightTheme } from '@hedvig-ui'
import { select } from '@storybook/addon-knobs'
import React from 'react'

const ThemeWrapper = styled.div`
  min-height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
`

export const withTheme = (story: () => React.ReactElement) => (
  <ThemeProvider
    theme={
      { lightTheme, darkTheme }[
        select('Theme', ['lightTheme', 'darkTheme'], 'lightTheme')
      ]
    }
  >
    <ThemeWrapper>{story()}</ThemeWrapper>
  </ThemeProvider>
)
