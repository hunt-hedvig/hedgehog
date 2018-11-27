import ImageMessage from 'components/chat/messages/ImageMessage'
import SelectMessage from 'components/chat/messages/SelectMessage'
import * as types from 'lib/messageTypes'
import * as moment from 'moment'
import 'moment/locale/sv'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Label } from 'semantic-ui-react'
import styled from 'styled-components'

const MessageRow = styled.div`
  display: flex;
  justify-content: ${(props) => (props.left ? 'flex-start' : 'flex-end')};
  margin: ${(props) => (props.isQuestion ? '0px' : '20px 0')};
  width: 100%;
  box-sizing: border-box;
`

const MessageBox = styled.div`
  max-width: 400px;
`

const MessageBody = styled.div`
  white-space: pre-wrap;
  word-wrap: break-word;
  z-index: 2000;
  position: relative;
  border: 1px solid #d4d4d5;
  color: #4b4b4b;
  line-height: 1.4em;
  background: #fff;
  border-radius: 0.3rem;
  padding: 0.8em 1em;
  box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12),
    0 2px 10px 0 rgba(34, 36, 38, 0.15);

  &:before {
    position: absolute;
    content: '';
    width: 0.7em;
    height: 0.7em;
    background: #fff;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    z-index: 2;
    box-shadow: 1px 1px 0 0 #bababc;
    bottom: -0.3em;
    left: 1em;
    top: auto;
    right: auto;
    margin-left: 0;
  }
`

const MessageInfo = styled.div`
  margin: 0.5em 0;
`

const Video = styled.video`
  width: 350px;
`

const Message = ({
  left,
  content,
  isQuestionMessage,
  msgId,
  timestamp,
  from,
}) => (
  <MessageRow left={left} isQuestion={isQuestionMessage} id={`msg-${msgId}`}>
    <MessageBox>
      <MessageBody left={left}>
        {content.text}
        <br />
        <MessageContent content={content} />
      </MessageBody>
      {timestamp ? (
        <MessageInfo>
          <Label>
            {from}
            <Label.Detail>
              {moment(timestamp).format('HH:mm:ss DD MMMM YYYY')}
            </Label.Detail>
          </Label>
        </MessageInfo>
      ) : null}
    </MessageBox>
  </MessageRow>
)

Message.propTypes = {
  left: PropTypes.bool.isRequired,
  content: PropTypes.object.isRequired,
  isQuestionMessage: PropTypes.bool,
  msgId: PropTypes.number,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  from: PropTypes.string,
}

const MessageContent = ({ content }) => {
  switch (content.type) {
    case types.DATE:
      return <p>Date: {moment(content.date).format('MMMM Do YYYY')}</p>
    case types.AUDIO:
      return <audio src={content.URL} controls />
    case types.VIDEO:
      return <Video src={content.URL} controls />
    case types.PHOTO:
    case types.PARAGRAPH:
    case types.HERO:
      return <ImageMessage content={content} />
    case types.MULTIPLE_SELECT:
    case types.SINGLE_SELECT:
      return <SelectMessage content={content} />
    case types.FILE_UPLOAD:
      return <a href={content.url}>Attached file</a>
    default:
      return null
  }
}

MessageContent.propTypes = {
  content: PropTypes.object.isRequired,
}

export default Message
