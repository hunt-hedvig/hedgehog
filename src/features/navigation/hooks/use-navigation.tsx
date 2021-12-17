import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { PushKeyboardNavigation } from 'features/tracking/utils/tags'
import React, { createContext, useContext, useState } from 'react'

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
    },
  },
  Dashborad: {
    name: 'DASHBORAD_PAGE',
  },
  Members: {
    name: 'MEMBERS_PAGE',
    items: {
      Search: 'MEMBERS_SEARCH',
    },
  },
  Member: {
    name: 'MEMBER_PAGE',
  },
  Conversations: {
    name: 'CONVERSATIONS_PAGE',
  },
  Claims: {
    name: 'CLAIMS_PAGE',
  },
  ClaimsFilters: {
    name: 'CLAIMS_FILTERS',
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

const NavigationContext = createContext<NavigationContextProps>({
  focus: undefined,
  setFocus: (_?: string) => void 0,
})

export const useNavigation = () => useContext(NavigationContext)

export const NavigationProvider = ({ children }) => {
  // const [prevFocus, setPrevFocus] = useState<string>()
  const [mainFocus, setMainFocus] = useState<string>()

  const changeFocusHandler = (value?: string) => {
    setMainFocus(() => {
      // if (prev) {
      //   setPrevFocus(prev)
      // }

      PushKeyboardNavigation(`focus: ${value}` ?? 'focus: reset', [])

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
