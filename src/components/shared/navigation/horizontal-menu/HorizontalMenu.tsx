import { routesList } from 'lib/selectOptions'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Menu } from 'semantic-ui-react'
import { unsetClient } from 'store/actions/clientActions'

export default class HorizontalMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null,
    }
  }

  public itemClickHander = (menuItem) => {
    this.setState({ activeItem: menuItem.type })
    this.props.history.push(menuItem.route)
  }

  public logout = () => {
    this.props.dispatch(unsetClient())
  }

  public render() {
    return (
      <Menu stackable>
        {routesList.map((item, id) => (
          <Menu.Item
            key={id}
            name={item.type}
            onClick={this.itemClickHander.bind(this, item)}
            active={this.state.activeItem === item.type}
          >
            {item.text}
          </Menu.Item>
        ))}
        <Menu.Menu position="right">
          <Menu.Item name="logout" onClick={this.logout}>
            Logout
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}

HorizontalMenu.propTypes = {
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
}
