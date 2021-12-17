import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { PushKeyboardNavigation } from 'features/tracking/utils/tags'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface IFocusItems {
  [key: string]: {
    name: string
    items?: {
      [key: string]: string
    }
  }
}

export const FocusItems: IFocusItems = {
  Main: {
    name: 'MAIN_SECTION',
    items: {
      Sidebar: 'SIDEBAR_SECTION',
      Topbar: 'TOPBAR_SECTION',
      Modal: 'MODAL_SECTION',
    },
  },
  Dashborad: {
    name: 'DASHBORAD_PAGE',
  },
  Members: {
    name: 'MEMBERS_PAGE',
    items: {
      Search: 'MEMBERS_SEARCH',
      Suggestions: 'MEMBERS_SUGGESTIONS',
    },
  },
  Member: {
    name: 'MEMBER_PAGE',
    items: {
      Chat: 'MEMBER_CHAT',
      Tabs: 'MEMBER_TABS',
    },
  },
  Conversations: {
    name: 'CONVERSATIONS_PAGE',
  },
  Claims: {
    name: 'CLAIMS_PAGE',
    items: {
      ClaimsTemplates: 'CLAIMS_TEMPLATES',
      ClaimsFilters: 'CLAIMS_FILTERS',
    },
  },
  Claim: {
    name: 'CLAIM_PAGE',
  },
  Tools: {
    name: 'TOOLS_PAGE',
  },
}

interface NavigationContextProps {
  focus?: string
  setFocus: (focus?: string) => void
}

export const NavigationContext = createContext<NavigationContextProps>({
  focus: undefined,
  setFocus: (_?: string) => void 0,
})

export const useNavigation = () => useContext(NavigationContext)

export const NavigationProvider = ({ children }) => {
  const isEscapePressed = useKeyIsPressed(Keys.Escape)
  const [focus, setFocus] = useState<string>()
  const [_, setPrevFocus] = useState<string>()

  const changeFocusHandler = (value?: string) => {
    setFocus((prev) => {
      setPrevFocus(prev)

      PushKeyboardNavigation(`focus: ${value}` ?? 'focus: reset', [])

      return value
    })
  }

  useEffect(() => {
    if (isEscapePressed) {
      changeFocusHandler(undefined)
    }
  }, [isEscapePressed])

  return (
    <NavigationContext.Provider
      value={{
        focus,
        setFocus: changeFocusHandler,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export const useFocus = (value?: string) => {
  const { focus, setFocus } = useNavigation()

  useEffect(() => {
    if (!focus) {
      setFocus(value)
    }
  }, [focus])

  return () => setFocus()
}
