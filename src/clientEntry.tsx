import { ApolloProvider } from '@apollo/client'
import { createBrowserHistory, createMemoryHistory } from 'history'
import React from 'react'
import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { apolloClient } from 'server/apollo-client'
import { app } from 'portals'
import { css, Global } from '@emotion/react'
import { fonts, getCdnFontFaces } from '@hedviginsurance/brand'
import { DarkmodeProvider } from '@hedvig-ui/hooks/use-darkmode'

const App = app('Hope')

export const history =
  typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory()

const globalCss = css`
  ${getCdnFontFaces()}

  * {
    box-sizing: border-box;
    font-family: ${fonts.FAVORIT}, sans-serif;
    transition: background 1000ms, color 1000ms;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: ${fonts.FAVORIT}, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${fonts.FAVORIT}, sans-serif;
    font-kerning: none;
    font-weight: 400;
  }
`

ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <ApolloProvider client={apolloClient!}>
        <Global styles={globalCss} />
        <DarkmodeProvider>
          <App />
        </DarkmodeProvider>
      </ApolloProvider>
    </BrowserRouter>
  </CookiesProvider>,
  document.getElementById('react-root'),
)
