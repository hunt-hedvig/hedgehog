import { useGetMeQuery } from 'api/generated/graphql'

export const forceLogOut = () => {
  window.location.pathname = '/login/logout'
}

const getCookie = (name: string) => {
  return document?.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1]
}

export const useScopes = () => {
  const { data, loading, error } = useGetMeQuery()

  if (loading || error) {
    return null
  }

  if (data?.me) {
    const cookie = getCookie('_hvg_scope')
    console.log(cookie)
    return JSON.parse(cookie ?? 'null')
  }
}
