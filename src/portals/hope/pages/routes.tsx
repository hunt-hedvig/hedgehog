import { StandaloneMessage } from '@hedvig-ui'
import React, { Suspense, useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'
import { Redirect, Route, Switch, useLocation } from 'react-router'
import ImpersonateMemberPage from './tools/ImpersonateMemberPage'
import { useFeatureFlag } from 'portals/hope/common/hooks/use-feature-flag'
import QuestionsPage from 'portals/hope/pages/QuestionsPage'
import DashboardPage from './DashboardPage'
import ProfilePage from './settings/ProfilePage'
import TasksPage from 'portals/hope/pages/tasks/TasksPage'
import CheckInPage from 'portals/hope/pages/tasks/CheckInPage'
import NotificationsPage from 'portals/hope/pages/NotificationsPage'
import SearchPage from 'portals/hope/pages/search/SearchPage'
import ClaimsListPage from 'portals/hope/pages/claims/list/ClaimsListPage'
import ClaimDetailsPage from 'portals/hope/pages/claims/ClaimDetailsPage'
import MemberSearchPage from 'portals/hope/pages/members/MemberSearchPage'
import MemberPage from 'portals/hope/pages/members/MemberPage'
import ToolsPage from 'portals/hope/pages/tools/ToolsPage'
import ChargesPage from 'portals/hope/pages/tools/ChargesPage'
import ClaimTypesPage from 'portals/hope/pages/tools/ClaimTypesPage'
import SwitcherAutomationPage from 'portals/hope/pages/tools/SwitcherAutomationPage'
import PerilsEditorPage from 'portals/hope/pages/tools/PerilsEditorPage'
import EmployeesPage from 'portals/hope/pages/tools/EmployeesPage'
import CampaignCodesPage from 'portals/hope/pages/tools/CampaignCodesPage'
import UnsignMemberPage from 'portals/hope/pages/tools/UnsignMemberPage'
import TemplateMessagesPage from 'portals/hope/pages/tools/TemplateMessagesPage'

export type Page<T = void> = React.FC<T>

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
        <Route path="/questions" component={TasksPage} />
        <Route path="/tasks" exact component={QuestionsPage} />
        <Route path="/tasks/check-in" exact component={CheckInPage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/search/:category" component={SearchPage} />
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
