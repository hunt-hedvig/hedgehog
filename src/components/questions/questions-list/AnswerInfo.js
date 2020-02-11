import * as moment from 'moment'
import * as PropTypes from 'prop-types'
import React from 'react'
import { Button, Header, Label, Segment } from 'semantic-ui-react'
import styled from 'styled-components'

const ChatLinkButton = styled(Button)`
  &&& {
    float: right;
  }
`

const AnswerInfo = ({ member, redirectClick }) => (
  <Segment>
    <Label ribbon>
      <Label.Detail>
        {moment(member.date).format('Do MM YYYY HH:mm')}
      </Label.Detail>
    </Label>
    <ChatLinkButton
      content="Open Chat"
      onClick={redirectClick.bind(this, member.memberId)}
    />
    {!member.answer.length ? (
      <Header size="medium">Done</Header>
    ) : (
      <React.Fragment>
        <Header size="medium">Admin answer:</Header>
        <Header size="small">{member.answer}</Header>
      </React.Fragment>
    )}
  </Segment>
)

AnswerInfo.propTypes = {
  member: PropTypes.object.isRequired,
  redirectClick: PropTypes.func.isRequired,
}

export default AnswerInfo
