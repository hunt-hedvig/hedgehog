import { ContractTab } from 'features/member/tabs/contracts-tab'
import { DetailsTab } from 'features/member/tabs/DetailsTab'
import { MemberFile } from 'features/member/tabs/files-tab/FileTab'
import { PaymentsTab } from 'features/member/tabs/payments-tab/PaymentsTab'
import { Quotes } from 'features/member/tabs/quote-tab'

import { ClaimsTab } from 'features/member/tabs/claims-tab/ClaimsTab'
import React from 'react'
import { Keys } from 'utils/hooks/key-press-hook'
import { AccountTab } from './account-tab'
import { CampaignsTab } from './campaigns-tab'
import { DebtTab } from './debt-tab'

export const memberPagePanes = (memberId, member) => [
  {
    tabTitle: 'Claims',
    tabName: 'claims',
    hotkey: {
      name: '(1)',
      key: Keys.One,
    },
    path: `members/${memberId}/claims`,
    component: () => <ClaimsTab memberId={memberId} />,
  },
  {
    tabTitle: 'Files',
    tabName: 'files',
    hotkey: {
      name: '(2)',
      key: Keys.Two,
    },
    path: `members/${memberId}/files`,
    component: () => <MemberFile memberId={memberId} />,
  },
  {
    tabTitle: 'Contracts',
    tabName: 'contracts',
    hotkey: {
      name: '(3)',
      key: Keys.Three,
    },
    path: `members/${memberId}/contracts`,
    component: () => <ContractTab memberId={memberId} />,
  },
  {
    tabTitle: 'Quotes',
    tabName: 'quotes',
    hotkey: {
      name: '(4)',
      key: Keys.Four,
    },
    path: `members/${memberId}/quotes`,
    component: () => <Quotes memberId={memberId} />,
  },
  {
    tabTitle: 'Payments',
    tabName: 'payments',
    hotkey: {
      name: '(5)',
      key: Keys.Five,
    },
    path: `members/${memberId}/payments`,
    component: () => <PaymentsTab memberId={memberId} />,
  },
  {
    tabTitle: 'Account',
    tabName: 'account',
    hotkey: {
      name: '(6)',
      key: Keys.Six,
    },
    path: `members/${memberId}/account`,
    component: () => <AccountTab memberId={memberId} />,
  },
  {
    tabTitle: 'Member',
    tabName: 'member',
    hotkey: {
      name: '(7)',
      key: Keys.Seven,
    },
    path: `members/${memberId}/member`,
    component: () => <DetailsTab member={member} />,
  },
  {
    tabTitle: 'Debt',
    tabName: 'debt',
    hotkey: {
      name: '(8)',
      key: Keys.Eight,
    },
    path: `members/${memberId}/debt`,
    component: () => <DebtTab memberId={memberId} />,
  },
  {
    tabTitle: 'Campaigns',
    tabName: 'campaigns',
    hotkey: {
      name: '(9)',
      key: Keys.Nine,
    },
    path: `members/${memberId}/campaigns`,
    component: () => <CampaignsTab memberId={memberId} />,
  },
]
