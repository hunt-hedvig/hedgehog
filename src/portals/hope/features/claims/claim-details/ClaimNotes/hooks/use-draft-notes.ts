import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { useEffect } from 'react'

interface useDraftNotesVariables {
  claimId: string
}

interface DraftNote {
  note: string
  expiry: number
}

export const useDraftNote = ({
  claimId,
}: useDraftNotesVariables): [string, (draft: string) => void] => {
  const hour = 60 * 60 * 1000
  const ttl = 24 * hour
  const [drafts, setDrafts] = useInsecurePersistentState<
    Record<string, DraftNote>
  >('drafts:notes', {})

  useEffect(() => {
    setDrafts((prevDrafts) => {
      const now = new Date().getTime()

      return Object.keys(prevDrafts)
        .filter((draftClaimId) => prevDrafts[draftClaimId].expiry > now)
        .reduce((obj, key) => {
          obj[key] = prevDrafts[key]
          return obj
        }, {})
    })
  }, [claimId])

  const update = (draft: string) => {
    setDrafts((prevDrafts) => {
      if (draft) {
        return {
          ...prevDrafts,
          [claimId]: { note: draft, expiry: new Date().getTime() + ttl },
        }
      }

      const draftsCopy = { ...prevDrafts }
      delete draftsCopy[claimId]
      return draftsCopy
    })
  }

  return [drafts[claimId]?.note ?? '', update]
}
