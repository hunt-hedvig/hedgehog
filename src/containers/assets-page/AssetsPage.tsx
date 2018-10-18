import Assets from 'components/assets'
import * as React from 'react'
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'
import actions from 'store/actions'

const AssetsPage = (props) => (
  <Container>
    <Assets {...props} />
  </Container>
)
const mapStateToProps = ({ assets, poll, messages }) => ({
  assets,
  poll,
  messages,
})

export default connect(
  mapStateToProps,
  {
    ...actions.assetsActions,
    ...actions.clientActions,
    ...actions.pollActions,
    memberRequest: actions.messagesActions.memberRequest,
  },
)(AssetsPage)
