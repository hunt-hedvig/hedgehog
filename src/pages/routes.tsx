import { StandaloneMessage } from '@hedvig-ui'
import React from 'react'
import { Route, Switch } from 'react-router'
import { ClaimDetailsPage } from './claims/ClaimDetailsPage'
import { ClaimsListPage } from './claims/list/ClaimsListPage'
import { DashboardPage } from './DashboardPage'
import { MemberPage } from './members/MemberPage'
import { MemberSearchPage } from './members/MemberSearchPage'
import { QuestionsPage } from './QuestionsPage'
import { CampaignCodesPage } from './tools/CampaignCodesPage'
import { ChargesPage } from './tools/ChargesPage'
import { EmployeesPage } from './tools/EmployeesPage'
import { ItemizerPage } from './tools/ItemizerPage'
import { NorwegianTariffCreatorPage } from './tools/NorwegianTariffCreatorPage'
import { PerilsEditorPage } from './tools/PerilsEditorPage'
import { SwitcherAutomationPage } from './tools/SwitcherAutomationPage'
import { ToolsPage } from './tools/ToolsPage'
import { UnsignMemberPage } from './tools/UnsignMemberPage'

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={'/'} exact component={DashboardPage} />
      <Route path="/dashborad" component={DashboardPage} />
      <Route path="/questions" component={QuestionsPage} />
      <Route path="/claims/list/:page?" exact component={ClaimsListPage} />
      <Route
        path="/claims/:claimId/members/:memberId"
        exact
        component={ClaimDetailsPage}
      />
      <Route exact path="/members" component={MemberSearchPage} />
      <Route path="/members/:memberId/:tab?" component={MemberPage} />

      <Route path="/tools" exactcomponent={ToolsPage} />
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
      <Route path="/tools/itemizer" component={ItemizerPage} />
      <Route path="/tools/employees" component={EmployeesPage} />
      <Route path="/tools/campaign-codes" component={CampaignCodesPage} />
      <Route path="/tools/unsign-member" component={UnsignMemberPage} />
      <Route
        component={() => (
          <StandaloneMessage paddingTop={'25vh'}>
            Page not found
          </StandaloneMessage>
        )}
      />
    </Switch>
  )
}
