import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { useEffect } from 'react'

interface UseDraftMessagesVariables {
  memberId: string
}

interface DraftMessage {
  message: string
  expiry: number
}

export const useDraftMessage = ({
  memberId,
}: UseDraftMessagesVariables): [string, (draft: string) => void] => {
  const hour = 60 * 60 * 1000
  const ttl = 24 * hour
  const [drafts, setDrafts] = useInsecurePersistentState<
    Record<string, DraftMessage>
  >('hvg:drafts', {})

  useEffect(() => {
    setDrafts((prevDrafts) => {
      const now = new Date().getTime()

      return Object.keys(prevDrafts)
        .filter((draftMemberId) => prevDrafts[draftMemberId].expiry > now)
        .reduce((obj, key) => {
          obj[key] = prevDrafts[key]
          return obj
        }, {})
    })
  }, [memberId])

  const update = (draft: string) => {
    setDrafts((prevDrafts) => {
      if (draft) {
        return {
          ...prevDrafts,
          [memberId]: { message: draft, expiry: new Date().getTime() + ttl },
        }
      }

      const draftsCopy = { ...prevDrafts }
      delete draftsCopy[memberId]
      return draftsCopy
    })
  }

  return [drafts[memberId]?.message ?? '', update]
}
