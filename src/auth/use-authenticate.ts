import { useAuthenticationQuery } from 'types/generated/graphql'
import { useEffect, useState } from 'react'
import { ApolloError } from '@apollo/client'

interface UseAuthenticateResult {
  role: string | null
  portal: string | null
  availablePortals: string[]
  loading: boolean
  error: ApolloError | null
}

export const useAuthenticate = (): UseAuthenticateResult => {
  const maxRefetchAttempts = 5

  const [refetchAttempt, setRefetchAttempt] = useState(0)
  const { data, loading, error } = useAuthenticationQuery({
    pollInterval: 3000,
  })

  useEffect(() => {
    if (loading) {
      return
    }

    if (data?.me || refetchAttempt >= maxRefetchAttempts) {
      setRefetchAttempt(0)
      return
    }

    setRefetchAttempt((prevRefetchAttempt) => prevRefetchAttempt + 1)
  }, [data, loading])

  if (loading) {
    return {
      loading: true,
      portal: null,
      role: null,
      error: null,
      availablePortals: data?.me.availablePortals ?? [],
    }
  }

  if (data?.me) {
    return {
      portal: data.me.portal,
      role: data.me.portal,
      loading: false,
      error: null,
      availablePortals: data?.me.availablePortals ?? [],
    }
  }

  return {
    portal: null,
    role: null,
    loading: false,
    error: refetchAttempt > 5 && error ? error : null,
    availablePortals: data?.me.availablePortals ?? [],
  }
}
