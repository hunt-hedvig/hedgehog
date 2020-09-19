import { MembersSearch, Props } from 'components/members-search'
import React from 'react'
import { connect } from 'react-redux'
import { searchMemberRequest as searchMemberRequestAction } from 'store/actions/membersActions'
import { useMemberSearch } from '../../graphql/use-member-search'

// TODO: Inject new MemberSearchPageComponent here
// TODO: Shouldn't we generate Member type from graphql:gen instead?

export const MembersSearchPage: React.FC<{}> = () => {
  const [memberSearchResult, { loading, error }] = useMemberSearch('')

  return <></>
}

// TODO: --

export const MembersSearchPageComponentOLD: React.FC<Props> = ({
  searchMemberRequest,
  searchResult,
  searchLoading,
}) => (
  <MembersSearch
    searchMemberRequest={searchMemberRequest}
    searchResult={searchResult}
    searchLoading={searchLoading}
  />
)

const mapState = (
  state: any,
): Pick<Props, 'searchResult' | 'searchLoading'> => ({
  searchResult: state.members.searchResult,
  searchLoading: state.members.requesting,
})

export const MembersSearchPageOLD = connect(mapState, {
  searchMemberRequest: searchMemberRequestAction,
})(MembersSearchPageComponentOLD)
