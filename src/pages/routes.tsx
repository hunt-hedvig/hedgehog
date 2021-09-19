import { StandaloneMessage } from '@hedvig-ui'
import { ConversationsPage } from 'pages/conversations/ConversationsPage'
import { ConversationsSettingsPage } from 'pages/conversations/ConversationsSettingsPage'
import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { ClaimDetailsPage } from './claims/ClaimDetailsPage'
import { ClaimsListPage } from './claims/list/ClaimsListPage'
import { DashboardPage } from './DashboardPage'
import { MemberPage } from './members/MemberPage'
import { MemberSearchPage } from './members/MemberSearchPage'
import { QuestionsPage } from './QuestionsPage'
import { CampaignCodesPage } from './tools/CampaignCodesPage'
import { ChargesPage } from './tools/ChargesPage'
import { EmployeesPage } from './tools/EmployeesPage'
import { NorwegianTariffCreatorPage } from './tools/NorwegianTariffCreatorPage'
import { PerilsEditorPage } from './tools/PerilsEditorPage'
import { SwitcherAutomationPage } from './tools/SwitcherAutomationPage'
import { ToolsPage } from './tools/ToolsPage'
import { UnsignMemberPage } from './tools/UnsignMemberPage'

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={DashboardPage} />
      <Route path="/dashborad" component={DashboardPage} />
      <Route path="/questions" component={QuestionsPage} />
      <Route
        path="/conversations/settings"
        component={ConversationsSettingsPage}
      />
      <Route path="/conversations/:memberId?" component={ConversationsPage} />
      <Route path="/claims/list/:page?" exact component={ClaimsListPage} />
      <Route path="/claims/:claimId" exact component={ClaimDetailsPage} />
      <Redirect
        path="/claims/:claimId/members/:memberId"
        to="/claims/:claimId"
      />
      <Route exact path="/members" component={MemberSearchPage} />
      <Route path="/members/:memberId/:tab?" component={MemberPage} />

      <Route path="/tools" exact component={ToolsPage} />
      <Route path="/tools/charges" component={ChargesPage} />
      <Route
        path="/tools/switcher-automation"
        component={SwitcherAutomationPage}
      />
      <Route path="/tools/perils-editor" component={PerilsEditorPage} />
      <Route
        path="/tools/norwegian-tariff-creator"
        component={NorwegianTariffCreatorPage}
      />
      <Route path="/tools/employees" component={EmployeesPage} />
      <Route path="/tools/campaign-codes" component={CampaignCodesPage} />
      <Route path="/tools/unsign-member" component={UnsignMemberPage} />
      <Route
        component={() => (
          <StandaloneMessage paddingTop="25vh">
            Page not found
          </StandaloneMessage>
        )}
      />
    </Switch>
  )
}
