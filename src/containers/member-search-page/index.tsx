import { MembersSearch, Props } from 'components/members-search'
import React from 'react'
import { connect } from 'react-redux'
import { searchMemberRequest as searchMemberRequestAction } from 'store/actions/membersActions'

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

const mapState = (
  state: any,
): Pick<Props, 'searchResult' | 'searchLoading'> => ({
  searchResult: state.members.searchResult,
  searchLoading: state.members.requesting,
})

export const MembersSearchPage = connect(mapState, {
  searchMemberRequest: searchMemberRequestAction,
})(MembersSearchPageComponent)
