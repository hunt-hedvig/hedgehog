import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import MessagesList from 'components/chat/messages/MessagesList';
import ChatPanel from 'components/chat/chat/ChatPanel';

const ChatTab = ({ messages, error, match, socket, addMessage }) => (
    <React.Fragment>
        <MessagesList
            messages={messages.list}
            error={!!socket}
            id={match.params.id}
            messageId={match.params.msgId}
        />
        <ChatPanel addMessage={addMessage} select={messages.select} />
        {error && <Message negative>{error.message}</Message>}
    </React.Fragment>
);

ChatTab.propTypes = {
    match: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
    addMessage: PropTypes.func.isRequired,
    error: PropTypes.object,
    socket: PropTypes.object
};

export default ChatTab;
