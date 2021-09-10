import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Me, useGetMeQuery } from 'types/generated/graphql'

export const forceLogOut = () => {
  window.location.pathname = '/login/logout'
}

interface UseAuthenticateResult {
  me?: Me
  loading: boolean
}

export const useAuthenticate = (): UseAuthenticateResult => {
  const maxRefetchAttempts = 5

  const location = useLocation()
  const [refetchAttempt, setRefetchAttempt] = useState(0)
  const { data, loading, startPolling, stopPolling } = useGetMeQuery({
    fetchPolicy: 'no-cache',
    pollInterval: 500,
  })

  useEffect(() => {
    startPolling(500)
  }, [location])

  useEffect(() => {
    if (data?.me || refetchAttempt >= maxRefetchAttempts) {
      setRefetchAttempt(0)
      stopPolling()
      return
    }
    setRefetchAttempt((prevRefetchAttempt) => prevRefetchAttempt + 1)
  }, [data, loading])

  if (loading) {
    return { loading: true }
  }

  if (data?.me) {
    return { me: data.me, loading: false }
  }

  return { loading: false }
}
