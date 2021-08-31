import { useGetMeQuery } from 'api/generated/graphql'
import { useCookies } from 'react-cookie'

export const forceLogOut = () => {
  window.location.pathname = '/login/logout'
}

export const useScopes = () => {
  const { data, loading, error } = useGetMeQuery()
  const [cookies] = useCookies()

  if (loading || error) {
    return null
  }

  if (data?.me) {
    const cookie = cookies.get('_hvg_scope')
    return JSON.parse(cookie ?? 'null')
  }
}
