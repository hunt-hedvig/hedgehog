import { addDays, addMinutes } from 'date-fns'
import { ExtendableContext, Middleware } from 'koa'
import { config } from './config'
import { LoggingMiddleware } from './request-enhancers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch')

interface Tokens {
  accessToken: string
  refreshToken: string
  tokenSource?: 'auth' | 'gatekeeper'
}

function setTokenCookies(
  ctx: ExtendableContext,
  { accessToken, refreshToken, tokenSource }: Tokens,
) {
  ctx.cookies.set('_hvg_at', accessToken, {
    path: '/',
    httpOnly: true,
    secure: config.useSecureCookies,
    expires: addMinutes(new Date(), 3 * 60),
  })
  ctx.cookies.set('_hvg_rt', refreshToken, {
    path: '/',
    httpOnly: true,
    secure: config.useSecureCookies,
    expires: addDays(new Date(), 30),
  })
  ctx.cookies.set('_hvg_src', tokenSource, {
    path: '/',
    httpOnly: true,
    secure: config.useSecureCookies,
    expires: addDays(new Date(), 30),
  })
}

function getTokenFromQuery(token: undefined | string | string[]) {
  if (Array.isArray(token)) {
    return token[0]
  }

  return token || ''
}

export const loginCallback: Middleware<object> = async (ctx) => {
  const accessToken = getTokenFromQuery(ctx.request.query['access-token'])
  const refreshToken = getTokenFromQuery(ctx.request.query['refresh-token'])
  const tokenSource =
    ctx.request.query['source'] === 'auth' ? 'auth' : 'gatekeeper'

  setTokenCookies(ctx, { accessToken, refreshToken, tokenSource })

  ctx.redirect('/')
}

export const logout: Middleware<object> = async (ctx) => {
  setTokenCookies(ctx, { accessToken: '', refreshToken: '' })
  ctx.redirect('/login-provider')
}

export const refreshTokenCallback: Middleware<LoggingMiddleware> = async (
  ctx,
) => {
  const tokenSource = ctx.cookies.get('_hvg_src') as
    | 'auth'
    | 'gatekeeper'
    | undefined
  const refreshToken = ctx.cookies.get('_hvg_rt') ?? ''

  let response: any
  if (tokenSource === 'auth') {
    // We logged in with the Auth service, we should refresh in the auth service
    const request = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }
    response = await fetch(config.authServiceHost + '/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(request),
    })
  } else {
    // We're in Gatekeeper territory
    const request = [
      'client_id=' + encodeURIComponent(config.oauthClientId),
      'client_secret=' + encodeURIComponent(config.oauthClientSecret),
      'grant_type=refresh_token',
      'refresh_token=' + encodeURIComponent(refreshToken),
    ]
    response = await fetch(config.gatekeeperHost + '/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: request.join('&'),
    })
  }

  const body = (await response.json()) as Record<string, string>

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
    tokenSource,
  })

  ctx.status = 200
  ctx.body = { status: 'ok' }
}
