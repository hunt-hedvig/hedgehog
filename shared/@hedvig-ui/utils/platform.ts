import { Key, Keys } from '@hedvig-ui/utils/key-press-hook'

interface UsePlatformResult {
  isMetaKey: (KeyBoardEvent) => boolean
  metaKey: Key
  platform: 'Mac' | 'Other'
}

export const usePlatform = (): UsePlatformResult => {
  const isMac = window.navigator.appVersion.indexOf('Mac') !== -1
  return {
    isMetaKey: (e) => (isMac ? e.metaKey : e.ctrlKey),
    metaKey: isMac ? Keys.Command : Keys.Control,
    platform: isMac ? 'Mac' : 'Other',
  }
}
