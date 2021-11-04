import { useTracking } from 'features/tracking/hooks/use-tracking'
import { useEffect, useState } from 'react'
import { Me, useGetMeQuery } from 'types/generated/graphql'

interface UseAuthenticateResult {
  me?: Me
  loading: boolean
}

export const useAuthenticate = (): UseAuthenticateResult => {
  const maxRefetchAttempts = 5

  const tracking = useTracking()

  const [refetchAttempt, setRefetchAttempt] = useState(0)
  const { data, loading } = useGetMeQuery({
    fetchPolicy: 'no-cache',
    pollInterval: 3000,
    variables: {
      tracking: tracking.data,
    },
  })

  useEffect(() => {
    if (data?.me || refetchAttempt >= maxRefetchAttempts) {
      setRefetchAttempt(0)
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
