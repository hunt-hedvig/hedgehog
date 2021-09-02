import { MembersSearch } from 'components/members-search'
import { MemberPage } from 'containers/MemberPage'
import React from 'react'
import { Route, Switch } from 'react-router'

const MessagesPageRouter = () => (
  <Switch>
    <Route exact path="/members" component={MembersSearch} />
    <Route path="/members/:memberId/:tab?" component={MemberPage} />
  </Switch>
)

export default MessagesPageRouter
