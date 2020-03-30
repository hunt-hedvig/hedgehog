import { ExtendableContext, Middleware } from 'koa'
import { addDays, addMinutes } from 'date-fns'
import fetch from 'node-fetch'
import { LoggingMiddleware } from './request-enhancers'
import { config } from './config'

interface Tokens {
  accessToken: string
  refreshToken: string
}

function setTokenCookies(
  ctx: ExtendableContext,
  { accessToken, refreshToken }: Tokens,
) {
  ctx.cookies.set('_hvg_at', accessToken, {
    path: '/',
    httpOnly: true,
    expires: addMinutes(new Date(), 3 * 60),
  })
  ctx.cookies.set('_hvg_rt', refreshToken, {
    path: '/',
    httpOnly: true,
    expires: addDays(new Date(), 30),
  })
}

export const loginCallback: Middleware<object> = async (ctx) => {
  const accessToken = ctx.request.query['access-token']
  const refreshToken = ctx.request.query['refresh-token']
  setTokenCookies(ctx, { accessToken, refreshToken })

  await fetch(process.env.API_URL + '/api/settings/auth-success', {
    headers: { Cookie: encodeURI('_hvg_at=' + accessToken) },
    method: 'POST',
  })

  ctx.redirect('/dashboard')
}

export const logout: Middleware<object> = async (ctx) => {
  setTokenCookies(ctx, { accessToken: '', refreshToken: '' })
  ctx.redirect('/login')
}

export const refreshTokenCallback: Middleware<LoggingMiddleware> = async (
  ctx,
) => {
  const refreshToken = ctx.cookies.get('_hvg_rt') ?? ''
  const request = [
    'client_id=' + encodeURIComponent(config.oauthClientId),
    'client_secret=' + encodeURIComponent(config.oauthClientSecret),
    'grant_type=refresh_token',
    'refresh_token=' + encodeURIComponent(refreshToken),
  ]
  const response = await fetch(config.gatekeeperHost + '/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: request.join('&'),
  })

  const body = await response.json()

  if (!response.ok) {
    ctx.status = response.status
    ctx.body = body
    ctx.state
      .getLogger('tokenRefresh')
      .error('Something went wrong when refreshing token', ctx.body)
    return
  }
  setTokenCookies(ctx, {
    accessToken: body['access_token'],
    refreshToken: body['refresh_token'],
  })

  ctx.status = 200
  ctx.body = { status: 'ok' }
}