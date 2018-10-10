import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';


export default class LoginProcess extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.loginProcess();
    }

    render() {
        return (
            <Dimmer active inverted>
                <Loader />
            </Dimmer>
        )
    }
}

LoginProcess.propTypes = {
    loginProcess: PropTypes.func.isRequired
};
