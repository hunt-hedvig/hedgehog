import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header } from 'semantic-ui-react'
import MembersFilter from '../members/members-filter/MembersFilter'
import MemberInsuranceList from './member-insurance-list/MemberInsuranceList'

export default class MemberInsurance extends React.Component {
  constructor(props) {
    super(props)
  }

  public componentDidMount() {
    const {
      memberInsurance: { filter, query },
      searchMemberInsRequest,
    } = this.props
    searchMemberInsRequest({ query, filter })
  }

  public render() {
    const {
      setMemberInsFilter,
      searchMemberInsRequest,
      memberInsurance,
    } = this.props
    return (
      <React.Fragment>
        <Header size="huge"> Member Insurance </Header>
        <MembersFilter
          data={memberInsurance}
          setFilter={setMemberInsFilter}
          search={searchMemberInsRequest}
          filterName="State"
        />
        <MemberInsuranceList {...this.props} />
      </React.Fragment>
    )
  }
}
MemberInsurance.propTypes = {
  memberInsurance: PropTypes.object.isRequired,
  memberInsRequest: PropTypes.func.isRequired,
  searchMemberInsRequest: PropTypes.func.isRequired,
  setMemberInsFilter: PropTypes.func.isRequired,
}
