import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

export default class LoginProcess extends React.Component {
  constructor(props) {
    super(props)
  }

  public componentDidMount() {
    this.props.loginProcess()
  }

  public render() {
    return (
      <Dimmer active inverted>
        <Loader />
      </Dimmer>
    )
  }
}

LoginProcess.propTypes = {
  loginProcess: PropTypes.func.isRequired,
}
