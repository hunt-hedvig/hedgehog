import InsuranceList from 'components/chat/insurance-list/InsuranceList'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header } from 'semantic-ui-react'

export default class InsuranceListTab extends React.Component {
  constructor(props) {
    super(props)
  }

  public render() {
    const { insurance } = this.props

    return insurance.list ? (
      <React.Fragment>
        <InsuranceList {...this.props} />
      </React.Fragment>
    ) : (
      <Header>No insurance info </Header>
    )
  }
}

InsuranceListTab.propTypes = {
  insurance: PropTypes.object.isRequired,
}
