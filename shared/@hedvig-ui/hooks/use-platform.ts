import { Key, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import React from 'react'

interface UsePlatformResult {
  isMetaKey: (e: KeyboardEvent | React.KeyboardEvent<any>) => boolean
  metaKey: Key
  platform: 'Mac' | 'Other'
}

export const usePlatform = (): UsePlatformResult => {
  const isMac = window.navigator.appVersion.indexOf('Mac') !== -1
  return {
    isMetaKey: (e: KeyboardEvent | React.KeyboardEvent<any>) =>
      isMac ? e.metaKey : e.ctrlKey,
    metaKey: isMac ? Keys.Command : Keys.Control,
    platform: isMac ? 'Mac' : 'Other',
  }
}
