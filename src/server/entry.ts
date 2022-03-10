import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import Koa from 'koa'
import compress from 'koa-compress'
import koaHelmet from 'koa-helmet'
import mount from 'koa-mount'
import Router from 'koa-router'
import proxy from 'koa-server-http-proxy'
import serve from 'koa-static'
import path from 'path'
import 'source-map-support/register'
import tls from 'tls'
import { loginCallback, logout, refreshTokenCallback } from './auth'
import { config } from './config'
import {
  loggerFactory,
  logRequestMiddleware,
  setLoggerMiddleware,
  setRequestUuidMiddleware,
} from './request-enhancers'

dotenv.config()

const template = () => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hope</title>
  <link rel="icon" type="image/png" href="/static/favicon.png">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
  <link rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
  <style>
  body {
    overflow-x: visible;
  }
</style>
</head>
<body>
  <div id="react-root"></div>

  <script>
    window.LOGIN_URL = ${JSON.stringify(config.loginUrl)};
    window.HOPE_FEATURES = {
      "stagingSpecificTools": ${JSON.stringify(config.stagingSpecificTools)},
      "swishPayoutsEnabled": ${JSON.stringify(config.swishPayoutsEnabled)},
    };
  </script>
  <script src="${scriptLocation}"></script>
</body>
</html>
`

const getPage: Koa.Middleware = async (ctx) => {
  ctx.body = template()
}
const getPort = () => (process.env.PORT ? Number(process.env.PORT) : 9000)

const logger = loggerFactory.getLogger('app')

logger.info(`Booting server on ${getPort()} 👢`)
const app = new Koa()
const router = new Router()

app.proxy = true

if (config.useHelmet) {
  app.use(
    koaHelmet({
      contentSecurityPolicy: false,
    }),
  )
  logger.info(`Securing headers with Helmet ⛑`)
}

app.use(compress({ threshold: 5 * 1024 }))

const buildDir = path.resolve(__dirname, '../../build')
const staticDir = path.resolve(__dirname, '../../static')
const scriptLocation =
  process.env.NODE_ENV === 'production'
    ? '/static/' +
      JSON.parse(readFileSync(path.resolve(buildDir, 'stats.json'), 'utf-8'))
        .assetsByChunkName.app[0]
    : '/static/app.js'
app.use(mount('/static', serve(buildDir, { maxage: 86400 * 1000 * 365 })))
app.use(mount('/static', serve(staticDir, { maxage: 86400 * 1000 * 365 })))

if (process.env.NODE_ENV !== 'production') {
  app.use(
    proxy('/static', {
      target: 'http://localhost:9001',
    }),
  )
}

app.use(setRequestUuidMiddleware)
app.use(setLoggerMiddleware)
app.use(logRequestMiddleware)
app.use(router.middleware())

router.get('/login/callback', loginCallback)
router.get('/login/logout', logout)
router.post('/login/refresh', refreshTokenCallback)
logger.info(`Using gatekeeper "${config.gatekeeperHost}"`)
logger.info(`Using auth "${config.authServiceHost}"`)

router.get(/^\/(?!api|chat|graphiql|vendor).*/, getPage)
app.use(
  proxy({
    target: process.env.API_URL,
    logLevel: 'silent',
    changeOrigin: false,
    ssl: {
      checkServerIdentity(_: unknown, cert: tls.PeerCertificate) {
        if (!process.env.API_URL) {
          logger.error('No API_URL defined, exiting')
          server.close()
          return
        }

        tls.checkServerIdentity(new URL(process.env.API_URL).hostname, cert)
      },
    },
    ws: true,
  }),
)

export const server = app.listen(getPort(), () => {
  logger.info(`Server started 🚀 listening on port ${getPort()}`)
})
