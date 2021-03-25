import { Member } from 'components/member'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import actions from 'store/actions'
import { useGetMemberInfo } from 'graphql/use-get-member-info'

const MemberPage = (props) => {
  const memberId = props.match.params.memberId
  const [member] = useGetMemberInfo(memberId)

  if (!member) {
    return null
  }

  return <Member {...props} member={member} />
}

const mapStateToProps = ({ auth, payoutDetails }) => ({
  auth,
  payoutDetails,
})

export default connect(
  mapStateToProps,
  {
    ...actions.clientActions,
    ...actions.notificationsActions,
    ...actions.payoutDetailsActions,
  },
  null,
  { pure: false },
)(withRouter(MemberPage))
