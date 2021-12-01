import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface FocusItemsType {
  Main: {
    name: string
    items: {
      Sidebar: string
      Topbar: string
      Modal: string
    }
  }
  Dashborad: {
    name: string
  }
  Members: {
    name: string
    items: {
      Search: string
      Suggestions: string
    }
  }
  Member: {
    name: string
    items: {
      Chat: string
      Tabs: string
      ContractTable: string
      QuoteTabs: string
    }
  }
  Conversations: {
    name: string
  }
  Claims: {
    name: string
    items: {
      ClaimsTemplates: string
      ClaimsFilters: string
    }
  }
  Claim: {
    name: string
  }
  Tools: {
    name: string
  }
}

export const FocusItems: FocusItemsType = {
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
      ContractTable: 'MEMBER_CONTRACT_TABLE',
      QuoteTabs: 'MEMBER_QUOTE_TABS',
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
  focus: string | null
  setFocus: (focus: string | null) => void
}

export const NavigationContext = createContext<NavigationContextProps>({
  focus: null,
  setFocus: (_: string | null) => void 0,
})

export const useNavigation = () => useContext(NavigationContext)

export const NavigationProvider = ({ children }) => {
  const isEscapePressed = useKeyIsPressed(Keys.Escape)
  const [focus, setFocus] = useState<string | null>(null)
  const [_, setPrevFocus] = useState<string | null>(null)

  const changeFocusHandler = (value: string | null) => {
    setFocus((prev) => {
      setPrevFocus(prev)

      return value
    })
  }

  useEffect(() => {
    console.log(focus)
  }, [focus])

  useEffect(() => {
    if (isEscapePressed) {
      changeFocusHandler(null)
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

export const useFocus = (value: string | null) => {
  const { focus, setFocus } = useNavigation()

  useEffect(() => {
    if (!focus) {
      setFocus(value)
    }
  }, [focus])

  return () => setFocus(null)
}
