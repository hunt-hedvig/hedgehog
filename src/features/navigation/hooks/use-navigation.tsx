import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { PushKeyboardNavigation } from 'features/tracking/utils/tags'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface FocusItemsType {
  Main: {
    name: string
    items: {
      Sidebar: string
      Topbar: string
      Modal: string
      ModalFilters: string
      ModalSubmit: string
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
      Contract: string
      ContractTable: string
      ContractForm: string
      QuoteTabs: string
      Files: string
      Claims: string
      Payments: string
      PaymentsForm: string
      PaymentsFormField: string
      Account: string
      AccountEntries: string
      MonthlyEntries: string
      Member: string
      Debt: string
      Campaigns: string
    }
  }
  Questions: {
    name: string
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
      ModalFilters: 'MODAL_FILTERS',
      ModalSubmit: 'MODAL_SUBMIT',
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
      Contract: 'MEMBER_CONTRACT',
      ContractTable: 'MEMBER_CONTRACT_TABLE',
      ContractForm: 'MEMBER_CONTRACT_FORM',
      QuoteTabs: 'MEMBER_QUOTE_TABS',
      Files: 'MEMBER_FILES',
      Claims: 'MEMBER_CLAIMS',
      Payments: 'MEMBER_PAYMENTS',
      PaymentsForm: 'MEMBER_PAYMENTS_FORM',
      PaymentsFormField: 'MEMBER_PAYMENTS_FORM_FIELD',
      Account: 'MEMBER_ACCOUNT',
      AccountEntries: 'MEMBER_ACCOUNT_ENTRIES',
      MonthlyEntries: 'MEMBER_MONTHLY_ENTRIES',
      Member: 'MEMBER_MEMBER_TAB',
      Debt: 'MEMBER_DEBT',
      Campaigns: 'MEMBER_CAMPAIGNS',
    },
  },
  Questions: {
    name: 'QUESTIONS_PAGE',
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

      PushKeyboardNavigation(`focus: ${value}` ?? 'focus: reset', [])

      return value
    })
  }

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

export const useElementFocus = (
  ref: React.RefObject<HTMLElement>,
  focus: boolean,
) => {
  useEffect(() => {
    if (!ref.current) {
      return
    }

    if (focus) {
      ref.current.focus()
      ref.current.scrollIntoView({
        block: 'center',
      })
      return
    }

    ref.current.blur()
  }, [focus])
}
