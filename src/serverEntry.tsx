import {
  // tslint:disable-line ordered-imports
  createKoaServer,
  getScriptLocation,
} from '@hedviginsurance/web-survival-kit'
import { createServerApolloClient } from 'api/apollo-server'
import { renderStylesToString } from 'emotion-server'
import * as Koa from 'koa'
import * as path from 'path'
import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import 'source-map-support/register'
import { reactPageRoutes } from 'routes/routes'

import App from 'App'

const proxy = require('koa-server-http-proxy')
const scriptLocation = getScriptLocation({
  statsLocation: path.resolve(__dirname, 'assets'),
  webpackPublicPath: process.env.WEBPACK_PUBLIC_PATH || '',
})
const template = (body: string) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Hedvig's Asset Management Application</title>
  <link rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
        integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
        crossorigin="anonymous">
  <script src="https://cdn.ravenjs.com/3.22.3/raven.min.js"
          crossorigin="anonymous"></script>
</head>
<body>
  <div id="react-root">${body}</div>
  
  <script src="${scriptLocation}"></script>
</body>
</html>
`

const getPage: Koa.Middleware = async (ctx) => {
  const context = {}
  const apolloClient = createServerApolloClient(ctx.state.requestUuid)
  const reactBody = renderStylesToString(
    renderToString(
      <StaticRouter location={ctx.url} context={context}>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </StaticRouter>,
    ),
  )
  ctx.body = template(reactBody)
}
const getPort = () => (process.env.PORT ? Number(process.env.PORT) : 9000)

console.log(`Booting server on ${getPort()} 👢`) // tslint:disable-line no-console

const server = createKoaServer({
  publicPath: '/assets',
  assetLocation: __dirname + '/assets',
})

server.router.get('/', getPage)
reactPageRoutes.forEach((route) => {
  server.router.get(route.path, getPage)
})

server.app.use(proxy({
  target: 'http://localhost:8443',
  changeOrigin: false
}))

server.app.listen(getPort(), () => {
  console.log(`Server started 🚀 listening on port ${getPort()}`) // tslint:disable-line no-console
})
