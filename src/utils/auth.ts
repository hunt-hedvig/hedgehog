import { useCookies } from 'react-cookie'

export const forceLogOut = () => {
  window.location.pathname = '/login/logout'
}

export const useScopes = () => {
  const [cookies] = useCookies()

  return cookies._hvg_scope ?? null
}
