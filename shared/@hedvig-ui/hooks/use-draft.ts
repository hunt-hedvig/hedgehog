import { useEffect } from 'react'
import createPersistedState from 'use-persisted-state'

const useDraftState = createPersistedState('drafts')

interface Draft {
  content: string
  expiry: number
}

export const useDraft = (id: string): [string, (draft: string) => void] => {
  const hour = 60 * 60 * 1000
  const ttl = 24 * hour
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [drafts, setDrafts] = useDraftState<Record<string, Draft>>({})

  useEffect(() => {
    setDrafts((prevDrafts: { [x: string]: Draft }) => {
      const now = new Date().getTime()

      return Object.keys(prevDrafts)
        .filter((draftId) => prevDrafts[draftId].expiry > now)
        .reduce<Record<string, Draft>>((obj, key) => {
          obj[key] = prevDrafts[key]
          return obj
        }, {})
    })
  }, [id])

  window.onstorage = (e) => {
    if (e.key === `hvg:drafts` && e.newValue) {
      const newDrafts = JSON.parse(e.newValue)
      setDrafts(newDrafts)
    }
  }

  const update = (draft: string) => {
    setDrafts((prevDrafts: Record<string, Draft>) => {
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return [drafts[id]?.content ?? '', update]
}
