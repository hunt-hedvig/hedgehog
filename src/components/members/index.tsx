import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header } from 'semantic-ui-react'
import MembersFilter from './members-filter/MembersFilter'
import MembersList from './members-list/MembersList'

export default class Members extends React.Component {
  constructor(props) {
    super(props)
  }

  public componentDidMount() {
    const {
      members: { filter, query },
      searchMemberRequest,
    } = this.props
    searchMemberRequest({ query, filter })
  }

  public render() {
    const { members, setFilter, searchMemberRequest } = this.props
    return (
      <React.Fragment>
        <Header size="huge">Members</Header>
        <MembersFilter
          data={members}
          setFilter={setFilter}
          search={searchMemberRequest}
          filterName="Status"
        />
        <MembersList {...this.props} />
      </React.Fragment>
    )
  }
}

Members.propTypes = {
  members: PropTypes.object.isRequired,
  membersRequest: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  searchMemberRequest: PropTypes.func.isRequired,
}
