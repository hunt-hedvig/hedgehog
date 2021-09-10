import { StandaloneMessage } from '@hedvig-ui'
import React from 'react'
import { Route, Switch } from 'react-router'
import { ClaimDetails } from './claims/[claimId]/members/[memberId]'
import { ClaimsPage } from './claims/list/[page]'
import { DashboardPage } from './index'
import { MembersPage } from './members'
import { MemberPage } from './members/[memberId]/[tab]'
import { QuestionsPage } from './questions'
import { ToolsPage } from './tools'
import { CampaignCodesPage } from './tools/campaign-codes'
import { ChargesPage } from './tools/charges'
import { EmployeesPage } from './tools/employees'
import { ItemizerPage } from './tools/itemizer'
import { NorwegianTariffCreatorPage } from './tools/norwegian-tariff-creator'
import { PerilsEditorPage } from './tools/perils-editor'
import { SwitcherAutomationPage } from './tools/switcher-automation'
import { UnsignMemberPage } from './tools/unsign-member'

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={'/'} exact component={DashboardPage} />
      <Route path="/dashborad" component={DashboardPage} />
      <Route path="/questions" component={QuestionsPage} />
      <Route path="/claims/list/:page?" exact component={ClaimsPage} />
      <Route
        path="/claims/:claimId/members/:memberId"
        exact
        component={ClaimDetails}
      />
      <Route exact path="/members" component={MembersPage} />
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
