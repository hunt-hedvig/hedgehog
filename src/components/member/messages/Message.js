import ImageMessage from 'components/member/messages/ImageMessage'
import SelectMessage from 'components/member/messages/SelectMessage'
import { css } from 'emotion'
import { dateTimeFormatter } from 'lib/helpers'
import * as types from 'lib/messageTypes'
import moment from 'moment'
import 'moment/locale/sv'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'react-emotion'

const MessageRow = styled.div`
  display: flex;
  justify-content: ${(props) => (props.left ? 'flex-end' : 'flex-start')};
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
  color: ${({ theme }) => theme.foreground};
  line-height: 1.4em;
  background: ${(props) =>
    props.left ? props.theme.highlightLight : props.theme.highlightBackground};
  border-radius: 0.3rem;
  padding: 0.8em 1em;

  &:before {
    position: absolute;
    content: '';
    width: 0.7em;
    height: 0.7em;
    background: ${(props) =>
      props.left
        ? props.theme.highlightLight
        : props.theme.highlightBackground};

    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    z-index: 2;
    box-shadow: 1px 1px 0 0 ${({ theme }) => theme.border};
    bottom: -0.3em;
    ${({ left }) => css`
      ${left ? `right: 1em;` : `left: 1em;`};
    `};
    top: auto;
    margin-left: 0;
  }
`

const MessageInfo = styled.div`
  margin: 0.5em 0;
  font-size: 0.9rem;
  ${({ left }) => left && `text-align: right;`};
`
const Timestamp = styled.div`
  color: ${({ theme }) => theme.mutedText};
  font-size: 0.8rem;
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
        <MessageInfo left={left}>
          {from}
          <Timestamp>
            {dateTimeFormatter(timestamp, "MMM dd ''yy, HH:mm")}
          </Timestamp>
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
