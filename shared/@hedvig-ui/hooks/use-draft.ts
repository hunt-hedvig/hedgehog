import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { useEffect } from 'react'

interface useDraftVariables {
  id: string
  section: string
}

interface Draft {
  content: string
  expiry: number
}

export const useDraft = ({
  id,
  section,
}: useDraftVariables): [string, (draft: string) => void] => {
  const hour = 60 * 60 * 1000
  const ttl = 24 * hour
  const [drafts, setDrafts] = useInsecurePersistentState<Record<string, Draft>>(
    `drafts:${section}`,
    {},
  )

  useEffect(() => {
    setDrafts((prevDrafts) => {
      const now = new Date().getTime()

      return Object.keys(prevDrafts)
        .filter((draftId) => prevDrafts[draftId].expiry > now)
        .reduce((obj, key) => {
          obj[key] = prevDrafts[key]
          return obj
        }, {})
    })
  }, [id])

  window.onstorage = (e) => {
    if (e.key === `hvg:drafts:${section}`) {
      const newDrafts = JSON.parse(e.newValue)
      setDrafts(newDrafts)
    }
  }

  const update = (draft: string) => {
    setDrafts((prevDrafts) => {
      if (draft) {
        return {
          ...prevDrafts,
          [id]: { content: draft, expiry: new Date().getTime() + ttl },
        }
      }

      const draftsCopy = { ...prevDrafts }
      delete draftsCopy[id]
      return draftsCopy
    })
  }

  return [drafts[id]?.content ?? '', update]
}
