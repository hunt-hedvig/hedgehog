import TagManager from 'react-gtm-module'

export const PushShortcutUsed = (name: string, keys: string[]) =>
  TagManager.dataLayer({
    dataLayer: {
      event: 'shortcut_used',
      shortcutName: name,
      shortcutKeys: keys,
    },
  })
