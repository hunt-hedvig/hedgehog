import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
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
  setFocus: (e?: string) => void
}

export const NavigationContext = createContext<NavigationContextProps>({
  focus: undefined,
  setFocus: (_?: string) => void 0,
})

export const useNavigation = () => useContext(NavigationContext)

export const NavigationProvider = ({ children }) => {
  // const [prevFocus, setPrevFocus] = useState<string>()
  const [mainFocus, setMainFocus] = useState<string>()

  useEffect(() => {
    console.log(mainFocus)
  }, [mainFocus])

  const changeFocusHandler = (value?: string) => {
    setMainFocus(() => {
      // if (prev) {
      //   setPrevFocus(prev)
      // }

      return value
    })
  }

  useKeyIsPressed(Keys.Escape, () => changeFocusHandler(undefined))

  return (
    <NavigationContext.Provider
      value={{
        focus: mainFocus,
        setFocus: changeFocusHandler,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
