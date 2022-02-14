import TagManager from 'react-gtm-module'

export const PushUserAction = (
  resource: string | null,
  action: string | null,
  field: string | null,
  value: string | null,
) =>
  TagManager.dataLayer({
    dataLayer: {
      event: 'user_action',
      userAction:
        (resource ? `${resource}` : '') +
        (action ? `:${action}` : '') +
        (field ? `:${field}` : '') +
        (value ? `:${value}` : ''),
    },
  })
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
