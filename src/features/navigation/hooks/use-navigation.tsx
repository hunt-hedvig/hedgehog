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
  secondaryFocus?: string
  setSecondaryFocus
}

const NavigationContext = createContext<NavigationContextProps>({
  focus: undefined,
  setFocus: (_?: string) => void 0,
  secondaryFocus: undefined,
  setSecondaryFocus: (_?: string) => void 0,
})

export const useNavigation = () => useContext(NavigationContext)

export const NavigationProvider = ({ children }) => {
  const [prevFocus, setPrevFocus] = useState<string>()
  const [mainFocus, setMainFocus] = useState<string>()
  const [secondaryFocus, setSecondaryFocus] = useState<string>()

  useEffect(() => {
    console.log('Prev: ' + prevFocus)
  }, [prevFocus])

  useEffect(() => {
    console.log('Main: ' + mainFocus)
  }, [mainFocus])

  useEffect(() => {
    console.log('Secondary: ' + secondaryFocus)
  }, [secondaryFocus])

  const changeFocusHandler = (value?: string) => {
    // if (secondaryFocus) {
    //   return
    // }

    setMainFocus((prev) => {
      if (prev) {
        setPrevFocus(prev)
      }

      return value
    })
  }

  const changeSecondaryFocusHandler = (value?: string) => {
    setSecondaryFocus(value)
  }

  useKeyIsPressed(Keys.Escape, () => {
    changeFocusHandler(undefined)
  })

  return (
    <NavigationContext.Provider
      value={{
        focus: mainFocus,
        setFocus: changeFocusHandler,
        setSecondaryFocus: changeSecondaryFocusHandler,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
