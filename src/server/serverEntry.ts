import * as dotenv from 'dotenv'
dotenv.config()

import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as compress from 'koa-compress'
import * as mount from 'koa-mount'
import * as serve from 'koa-static'
import * as proxy from 'koa-server-http-proxy'
import * as path from 'path'
import 'source-map-support/register'
import { loginCallback, refreshTokenCallback } from './auth'
import { config } from './config'
import {
  loggerFactory,
  logRequestMiddleware,
  setLoggerMiddleware,
  setRequestUuidMiddleware,
} from './request-enhancers'
import * as tls from 'tls'
import * as url from 'url'
import { readFileSync } from 'fs'

const template = () => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hedvig H.OPE.</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.10.1/css/all.css"
        crossorigin="anonymous">
  <script src="https://cdn.ravenjs.com/3.22.3/raven.min.js"
          crossorigin="anonymous"></script>
  <style>
  body {
    overflow-x: visible;
  }
</style>
</head>
<body>
  <div id="react-root"></div>

  <script src="${scriptLocation}"></script>
</body>
</html>
`

const getPage: Koa.Middleware = async (ctx) => {
  ctx.body = template()
}
const getPort = () => (process.env.PORT ? Number(process.env.PORT) : 9000)

console.log(`Booting server on ${getPort()} 👢`) // tslint:disable-line no-console

const logger = loggerFactory.getLogger('app')
const app = new Koa()
const router = new Router()
app.use(compress({ threshold: 5 * 1024 }))

const buildDir = path.resolve(__dirname, '../../build')
const scriptLocation =
  process.env.NODE_ENV === 'production'
    ? '/static/' +
      JSON.parse(readFileSync(path.resolve(buildDir, 'stats.json'), 'UTF8'))
        .assetsByChunkName.app[0]
    : 'http://localhost:9443/static/app.js'
app.use(mount('/static', serve(buildDir, { maxage: 86400 * 365 })))

app.use(setRequestUuidMiddleware)
app.use(setLoggerMiddleware)
app.use(logRequestMiddleware)
app.use(router.middleware())

router.get('/login/callback', loginCallback)
router.post('/login/refresh', refreshTokenCallback)
logger.info(`Using gatekeeper "${config.gatekeeperHost}"`)

router.get(/^\/(?!api|chat|graphiql|vendor).*/, getPage)
app.use(
  proxy({
    target: process.env.API_URL,
    changeOrigin: false,
    ssl: {
      checkServerIdentity(_host, cert) {
        tls.checkServerIdentity(url.parse(process.env.API_URL!).hostname!, cert)
      },
    },
    ws: true,
  }),
)

app.listen(getPort(), () => {
  logger.info(`Server started 🚀 listening on port ${getPort()}`)
})
