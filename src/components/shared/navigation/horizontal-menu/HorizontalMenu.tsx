import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import { unsetClient } from 'store/actions/clientActions';
import { routesList } from 'lib/selectOptions';

export default class HorizontalMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: null
        };
    }

    itemClickHander = menuItem => {
        this.setState({ activeItem: menuItem.type });
        this.props.history.push(menuItem.route);
    };

    logout = () => {
        this.props.dispatch(unsetClient());
    };

    render() {
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
        );
    }
}

HorizontalMenu.propTypes = {
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func
};
