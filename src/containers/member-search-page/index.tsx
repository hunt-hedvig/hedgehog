import { MembersSearch } from 'components/members-search'
import React from 'react'

// TODO: Inject new MemberSearchPageComponent here
// TODO: Shouldn't we generate Member type from graphql:gen instead?

export const MembersSearchPage: React.FC<{}> = () => {
  return <MembersSearch />
}
