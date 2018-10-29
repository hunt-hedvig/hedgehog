import * as React from 'react'
import { Header } from 'semantic-ui-react'
import initialState from '../../store/initialState'
import { MemberSearchFilter, MembersStore } from '../../store/storeTypes'
import MembersBackendFilter from './members-filter/MembersBackendFilter'
import MembersList from './members-list/MembersList'

export interface MembersProps {
  members: MembersStore
  searchMemberRequest: (q: MemberSearchFilter) => void
}

export default class Members extends React.Component<MembersProps, {}> {
  constructor(props: MembersProps) {
    super(props)
  }

  public componentDidMount() {
    const {
      members: { searchFilter },
      searchMemberRequest,
    } = this.props
    searchMemberRequest(searchFilter)
  }

  public render() {
    const { members, searchMemberRequest } = this.props
    return (
      <React.Fragment>
        <Header size="huge">Members</Header>
        <MembersBackendFilter
          members={members}
          search={searchMemberRequest}
          resetSearch={this.resetSearch}
        />
        <MembersList {...this.props} />
      </React.Fragment>
    )
  }

  private resetSearch = () => {
    this.props.searchMemberRequest(initialState.members.searchFilter)
  }
}
