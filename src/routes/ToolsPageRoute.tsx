import { NorwegianTariffCreator } from 'features/tools/norwegian-tariff-editor'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Tools } from '../features/tools'
import { CampaignCodeInfo } from '../features/tools/campaign-codes'
import { ChargePage } from '../features/tools/charges'
import { ItemizerComponent } from '../features/tools/itemizer'
import { PerilsEditor } from '../features/tools/perils-editor'
import { SwitcherAutomation } from '../features/tools/switcher-automation'

export const ToolsPageRoute: React.FunctionComponent = () => (
  <Switch>
    <Route component={Tools} path="/tools" exact />
    <Route component={ChargePage} path="/tools/charges" />
    <Route component={SwitcherAutomation} path="/tools/switcher-automation" />
    <Route component={PerilsEditor} path="/tools/perils-editor" />
    <Route
      component={NorwegianTariffCreator}
      path="/tools/norwegian-tariff-creator"
    />
    <Route component={ItemizerComponent} path="/tools/itemizer" />
    <Route component={CampaignCodeInfo} path="/tools/campaign-codes" />
  </Switch>
)
