import { StandaloneMessage } from '@hedvig-ui'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'
import { Redirect, Route, Switch, useLocation } from 'react-router'
import ImpersonateMemberPage from './tools/ImpersonateMemberPage'
import { useFeatureFlag } from 'portals/hope/common/hooks/use-feature-flag'

export type Page<T = void> = React.FC<T>

const DashboardPage = lazy(() => import('./dashboard/DashboardPage'))
const SearchPage = lazy(() => import('./search/SearchPage'))
const ProfilePage = lazy(() => import('./settings/ProfilePage'))
const QuestionsPage = lazy(() => import('./QuestionsPage'))
const ConversationsOnboardingPage = lazy(
  () => import('./conversations/ConversationsOnboardingPage'),
)
const ConversationsPage = lazy(
  () => import('./conversations/ConversationsPage'),
)
const ClaimsListPage = lazy(() => import('./claims/list/ClaimsListPage'))
const ClaimDetailsPage = lazy(() => import('./claims/ClaimDetailsPage'))
const MemberSearchPage = lazy(() => import('./members/MemberSearchPage'))
const MemberPage = lazy(() => import('./members/MemberPage'))
const ToolsPage = lazy(() => import('./tools/ToolsPage'))
const ChargesPage = lazy(() => import('./tools/ChargesPage'))
const ClaimTypesPage = lazy(() => import('./tools/ClaimTypesPage'))
const SwitcherAutomationPage = lazy(
  () => import('./tools/SwitcherAutomationPage'),
)
const PerilsEditorPage = lazy(() => import('./tools/PerilsEditorPage'))

const EmployeesPage = lazy(() => import('./tools/EmployeesPage'))
const CampaignCodesPage = lazy(() => import('./tools/CampaignCodesPage'))
const UnsignMemberPage = lazy(() => import('./tools/UnsignMemberPage'))
const TemplateMessagesPage = lazy(() => import('./tools/TemplateMessagesPage'))

const NotificationsPage = lazy(() => import('./NotificationsPage'))

// Replace member IDs or UUIDs with {id} to simplify page tracking
const getCleanPath = (pathname: string) =>
  pathname
    .split('/')
    .map((subpath) => {
      if (subpath === '') {
        return subpath
      }

      const isNumber = !isNaN(Number(subpath))

      if (isNumber) {
        return '{id}'
      }

      return subpath.length < 16 ? subpath : '{id}'
    })
    .join('/')

export const Routes: React.FC = () => {
  const searchEverything = useFeatureFlag('SEARCH_EVERYTHING')
  const [prevPath, setPrevPath] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    if (prevPath === null) {
      setPrevPath(location.pathname)
      return
    }

    if (prevPath !== location.pathname) {
      TagManager.dataLayer({
        dataLayer: {
          event: 'virtual_page_view',
          cleanPath: getCleanPath(location.pathname),
          cleanPrevPath: getCleanPath(prevPath),
        },
      })
      setPrevPath(location.pathname)
    }
  }, [location.pathname])

  return (
    <Suspense fallback={<div />}>
      <Switch>
        <Route path="/" exact component={DashboardPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/dashborad" component={DashboardPage} />
        <Route path="/questions" component={QuestionsPage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/search" component={SearchPage} />
        <Route
          path="/conversations/onboarding"
          component={ConversationsOnboardingPage}
        />
        <Route path="/conversations/:memberId?" component={ConversationsPage} />
        <Route path="/claims/list/:page?" exact component={ClaimsListPage} />
        <Route path="/claims/:claimId" exact component={ClaimDetailsPage} />
        <Redirect
          path="/claims/:claimId/members/:memberId"
          to="/claims/:claimId"
        />
        <Route
          exact
          path="/members"
          component={searchEverything.active ? SearchPage : MemberSearchPage}
        />
        <Route path="/members/:memberId/:tab?" component={MemberPage} />

        <Route path="/tools" exact component={ToolsPage} />
        <Route path="/tools/charges" component={ChargesPage} />
        <Route path="/tools/claim-types" component={ClaimTypesPage} />
        <Route
          path="/tools/switcher-automation"
          component={SwitcherAutomationPage}
        />
        <Route path="/tools/perils-editor" component={PerilsEditorPage} />
        <Route path="/tools/employees" component={EmployeesPage} />
        <Route path="/tools/campaign-codes" component={CampaignCodesPage} />
        <Route path="/tools/unsign-member" component={UnsignMemberPage} />
        <Route
          path="/tools/template-messages"
          component={TemplateMessagesPage}
        />
        <Route
          path="/tools/impersonate-member"
          component={ImpersonateMemberPage}
        />
        <Route
          component={() => (
            <StandaloneMessage paddingTop="25vh">
              Page not found
            </StandaloneMessage>
          )}
        />
      </Switch>
    </Suspense>
  )
}
