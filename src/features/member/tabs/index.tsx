import { ContractTab } from 'features/member/tabs/contracts-tab'
import { MemberFile } from 'features/member/tabs/files-tab/FileTab'
import { MemberTab } from 'features/member/tabs/member-tab/MemberTab'
import { PaymentsTab } from 'features/member/tabs/payments-tab/PaymentsTab'
import { Quotes } from 'features/member/tabs/quote-tab'

import { Tabs } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { ClaimsTab } from 'features/member/tabs/claims-tab/ClaimsTab'
import {
  FocusItems,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import { useMemberHistory } from 'features/user/hooks/use-member-history'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { AccountTab } from './account-tab'
import { CampaignsTab } from './campaigns-tab'
import { DebtTab } from './debt-tab'

export const memberPagePanes = (memberId, member) => [
  {
    tabTitle: 'Claims',
    tabName: 'claims',
    hotkey: {
      name: '1',
      key: Keys.One,
    },
    path: `members/${memberId}/claims`,
    component: () => <ClaimsTab memberId={memberId} />,
  },
  {
    tabTitle: 'Files',
    tabName: 'files',
    hotkey: {
      name: '2',
      key: Keys.Two,
    },
    path: `members/${memberId}/files`,
    component: () => <MemberFile memberId={memberId} />,
  },
  {
    tabTitle: 'Contracts',
    tabName: 'contracts',
    hotkey: {
      name: '3',
      key: Keys.Three,
    },
    path: `members/${memberId}/contracts`,
    component: () => <ContractTab memberId={memberId} />,
  },
  {
    tabTitle: 'Quotes',
    tabName: 'quotes',
    hotkey: {
      name: '4',
      key: Keys.Four,
    },
    path: `members/${memberId}/quotes`,
    component: () => <Quotes memberId={memberId} />,
  },
  {
    tabTitle: 'Payments',
    tabName: 'payments',
    hotkey: {
      name: '5',
      key: Keys.Five,
    },
    path: `members/${memberId}/payments`,
    component: () => <PaymentsTab memberId={memberId} />,
  },
  {
    tabTitle: 'Account',
    tabName: 'account',
    hotkey: {
      name: '6',
      key: Keys.Six,
    },
    path: `members/${memberId}/account`,
    component: () => <AccountTab memberId={memberId} />,
  },
  {
    tabTitle: 'Member',
    tabName: 'member',
    hotkey: {
      name: '7',
      key: Keys.Seven,
    },
    path: `members/${memberId}/member`,
    component: () => <MemberTab member={member} />,
  },
  {
    tabTitle: 'Debt',
    tabName: 'debt',
    hotkey: {
      name: '8',
      key: Keys.Eight,
    },
    path: `members/${memberId}/debt`,
    component: () => <DebtTab memberId={memberId} />,
  },
  {
    tabTitle: 'Campaigns',
    tabName: 'campaigns',
    hotkey: {
      name: '9',
      key: Keys.Nine,
    },
    path: `members/${memberId}/campaigns`,
    component: () => <CampaignsTab memberId={memberId} />,
  },
]

export const MemberTabsList = ({ memberId, member }) => {
  const history = useHistory()
  const { pushToMemberHistory } = useMemberHistory()

  const pathname = history.location.pathname.split('/')
  const path =
    pathname.length === 4 ? pathname[pathname.length - 1] : 'contracts'

  const navigateToTab = (tabName) =>
    history.replace(`/members/${memberId}/${tabName}`)

  useEffect(() => {
    pushToMemberHistory(memberId)
    navigateToTab(path)
  }, [])

  const { focus, setFocus } = useNavigation()
  const isTPressed = useKeyIsPressed(Keys.T)

  useEffect(() => {
    if (isTPressed) {
      setFocus(FocusItems.Member.items.Tabs)
    }
  }, [isTPressed])

  return (
    <Tabs
      list={memberPagePanes(memberId, member).map((pane) => ({
        title: pane.tabTitle,
        active: path === pane.tabName,
        action: () => navigateToTab(pane.tabName),
        hotkey: pane.hotkey,
      }))}
      navigationAvailable={focus === FocusItems.Member.items.Tabs}
    />
  )
}
