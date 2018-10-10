import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

export default class Notification extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { content: { id }, closeHandler } = this.props;
        //eslint-disable-next-line
        setTimeout(() => {
            closeHandler(id);
        }, 10000);
    }

    render() {
        const {
            closeHandler,
            content: { header, id, message, type }
        } = this.props;
        const msgType = type ? type : 'red';
        return (
            <Message onDismiss={closeHandler.bind(this, id)} color={msgType}>
                {header ? <Message.Header>{header}</Message.Header> : null}
                <Message.Content>{message}</Message.Content>
            </Message>
        );
    }
}

Notification.propTypes = {
    closeHandler: PropTypes.func.isRequired,
    content: PropTypes.object.isRequired
};
