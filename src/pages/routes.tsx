import { StandaloneMessage } from '@hedvig-ui'
import { ClaimsList } from 'components/claims'
import { ClaimDetails } from 'components/claims/claim-details'
import { DashboardPage } from 'components/dashboard'
import { MembersSearch } from 'components/members-search'
import { QuestionsPage } from 'components/questions'
import { MemberPage } from 'containers/MemberPage'
import { Tools } from 'features/tools'
import { CampaignCodeInfo } from 'features/tools/campaign-codes'
import { ChargePage } from 'features/tools/charges'
import { Employees } from 'features/tools/employees'
import { ItemizerComponent } from 'features/tools/itemizer'
import { NorwegianTariffCreator } from 'features/tools/norwegian-tariff-editor'
import { PerilsEditor } from 'features/tools/perils-editor'
import { UnsignMemberTool } from 'features/tools/staging-tools/unsign-member-tool'
import { SwitcherAutomation } from 'features/tools/switcher-automation'
import React from 'react'
import { Route, Switch } from 'react-router'

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/dashborad" component={DashboardPage} />
      <Route path="/questions" component={QuestionsPage} />
      <Route exact path="/claims/list/:page?" component={ClaimsList} />
      <Route
        exact
        path="/claims/:claimId/members/:memberId"
        component={ClaimDetails}
      />
      <Route exact path="/members" component={MembersSearch} />
      <Route path="/members/:memberId/:tab?" component={MemberPage} />
      <Route component={Tools} path="/tools" exact />
      <Route component={ChargePage} path="/tools/charges" />
      <Route component={SwitcherAutomation} path="/tools/switcher-automation" />
      <Route component={PerilsEditor} path="/tools/perils-editor" />
      <Route
        component={NorwegianTariffCreator}
        path="/tools/norwegian-tariff-creator"
      />
      <Route component={ItemizerComponent} path="/tools/itemizer" />
      <Route component={Employees} path="/tools/employees" />
      <Route component={CampaignCodeInfo} path="/tools/campaign-codes" />
      <Route component={UnsignMemberTool} path="/tools/unsign-member" />
      <Route exact path={'/'} component={DashboardPage} />
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
