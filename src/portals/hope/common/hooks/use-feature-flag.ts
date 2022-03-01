import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { useEffect } from 'react'
import { differenceInDays } from 'date-fns'

interface UseFeatureFlag {
  active: boolean
  activate: () => void
  disable: () => void
}

interface FeatureFlagEntry {
  active: boolean
  accessedAt: Date
}

type FeatureFlagRegistry = Record<string, FeatureFlagEntry>

export const useFeatureFlag = (flag: string): UseFeatureFlag => {
  const [flags, setFlags] = useInsecurePersistentState<FeatureFlagRegistry>(
    `feature-flags`,
    {},
  )

  useEffect(() => {
    const now = new Date()

    Object.keys(flags).map((f) => {
      if (differenceInDays(now, new Date(flags[f].accessedAt)) > 7) {
        const tempFlags = { ...flags }

        delete tempFlags[f]

        setFlags(tempFlags)
      }
    })
  }, [])

  useEffect(() => {
    const onStorageHandler = (e: StorageEvent) => {
      if (e.key === `hvg:feature-flags` && e.newValue) {
        const parsedFlags = JSON.parse(e.newValue) as FeatureFlagRegistry
        const parsedFlag = parsedFlags[flag]

        if (Object.keys(parsedFlags).includes(flag)) {
          handleChange(parsedFlag.active)
        }
      }
    }

    window.addEventListener('storage', onStorageHandler)

    return () => window.removeEventListener('storage', onStorageHandler)
  }, [])

  const handleChange = (value: boolean) => {
    const newFlag = {
      active: value,
      accessedAt: new Date(),
    }

    setFlags((prevFlags) => ({ ...prevFlags, [flag]: newFlag }))
  }

  return {
    active: flags[flag]?.active ?? false,
    activate: () => handleChange(true),
    disable: () => handleChange(false),
  }
}
