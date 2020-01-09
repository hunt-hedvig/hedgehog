import React from 'react'
import { connect } from 'react-redux'
import { MembersSearch, Props } from 'components/members-search'
import { searchMemberRequest } from 'store/actions/membersActions'

export const MembersSearchPageComponent: React.FC<Props> = ({
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

const mapState = (state) => ({
  searchResult: state.members.searchResult,
  searchLoading: state.members.requesting,
})

export const MembersSearchPage = connect(mapState, { searchMemberRequest })(
  MembersSearchPageComponent,
)
