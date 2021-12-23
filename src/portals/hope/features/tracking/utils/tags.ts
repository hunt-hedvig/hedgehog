import TagManager from 'react-gtm-module'

export const PushShortcutUsed = (name: string, keys: string[]) =>
  TagManager.dataLayer({
    dataLayer: {
      event: 'shortcut_used',
      shortcutName: name,
      shortcutKeys: keys,
    },
  })

export const PushKeyboardNavigation = (name: string, keys: string[]) =>
  TagManager.dataLayer({
    dataLayer: {
      event: 'keyboard_navigation',
      keyboardNavigationName: name,
      keyboardNavigationKeys: keys,
    },
  })
