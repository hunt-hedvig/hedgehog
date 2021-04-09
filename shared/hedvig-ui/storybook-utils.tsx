import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { select } from '@storybook/addon-knobs'
import { darkTheme, lightTheme } from 'hedvig-ui/themes'
import React from 'react'

const ThemeWrapper = styled.div`
  min-height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
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
