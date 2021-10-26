import { Middleware } from 'koa'

import {
  LFService,
  Logger,
  LoggerFactoryOptions,
  LogGroupRule,
  LogLevel,
} from 'typescript-logging'
import uuidV4 from 'uuid/v4'

export interface LoggingMiddleware {
  getLogger: (name: string) => Logger
}

const options = new LoggerFactoryOptions().addLogGroupRule(
  new LogGroupRule(/.+/, LogLevel.fromString('info')),
)

export const loggerFactory = LFService.createLoggerFactory(options)

export const setRequestUuidMiddleware: Middleware = async (ctx, next) => {
  ctx.state.requestUuid = ctx.get('x-request-id') || uuidV4()

  await next()
}

export const setLoggerMiddleware: Middleware = async (ctx, next) => {
  ctx.state.getLogger = () => loggerFactory.getLogger('app')

  await next()
}

export const logRequestMiddleware: Middleware = async (ctx, next) => {
  const log = (e?: { status: any }) =>
    (e?.status ? e.status !== 200 : ctx.status !== 200) &&
    ctx.state
      .getLogger('request')
      .info(
        `${ctx.get('x-forwarded-proto') || ctx.request.protocol} ${
          ctx.request.method
        } ${ctx.request.originalUrl} - ${
          e && e.status ? e.status : ctx.status
        }`,
      )

  try {
    await next()
    log()
  } catch (e) {
    ctx.state.getLogger('request').error('Uncaught error in request', e)
    throw e
  }
}
