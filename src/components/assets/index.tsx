import AssetsList from 'components/assets/assets-list/AssetsList'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Dimmer, Header, Loader } from 'semantic-ui-react'

class AssetList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeList: [],
      filteredList: [],
      activeFilter: 'ALL',
    }
  }

  public assetUpdateHandler(id, value) {
    const { assetUpdate } = this.props
    assetUpdate(id, value)
  }

  public pollingHandler() {
    const {
      poll: { polling },
      pollStart,
      pollStop,
    } = this.props
    if (polling) {
      pollStop(2000)
    } else {
      pollStart(2000)
    }
  }

  public componentDidMount() {
    const { assetRequest, assets } = this.props
    if (!assets.list.length) {
      assetRequest()
    }
  }

  public componentWillUnmount() {
    const {
      poll: { polling },
      pollStop,
    } = this.props
    if (polling) {
      pollStop()
    }
  }

  public render() {
    const {
      assets: { requesting },
    } = this.props
    return (
      <React.Fragment>
        <Header size="huge">Assets</Header>
        <Dimmer active={requesting} inverted>
          <Loader size="large">Loading</Loader>
        </Dimmer>
        <AssetsList
          {...this.props}
          assetUpdate={this.assetUpdateHandler}
          pollingHandler={this.pollingHandler}
        />
      </React.Fragment>
    )
  }
}

export default AssetList

AssetList.propTypes = {
  assetUpdate: PropTypes.func.isRequired,
  assets: PropTypes.object,
  poll: PropTypes.object,
  pollStart: PropTypes.func,
  pollStop: PropTypes.func,
  setClient: PropTypes.func.isRequired,
  assetRequest: PropTypes.func.isRequired,
}
