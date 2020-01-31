import { Middleware } from 'koa'
import { addDays, addMinutes } from 'date-fns'
import fetch from 'node-fetch'

export const loginCallback: Middleware<any> = async (ctx) => {
  const accessToken = ctx.request.query['access-token']
  const refreshToken = ctx.request.query['refresh-token']
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

  await fetch(process.env.API_URL + '/api/settings/auth-success', {
    headers: { Cookie: encodeURI('_hvg_at=' + accessToken) },
    method: 'POST',
  })

  ctx.redirect('/dashboard')
}
