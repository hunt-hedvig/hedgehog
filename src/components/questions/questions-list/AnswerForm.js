import PropTypes from 'prop-types'
import React from 'react'
import {
  Button,
  Form as StandardForm,
  Message,
  TextArea,
} from 'semantic-ui-react'
import styled from 'react-emotion'
import { MemberHistoryContext } from '../../../utils/member-history'
import { Checkbox } from 'hedvig-ui/checkbox'

const Form = styled(StandardForm)`
  max-width: 35rem !important;
  padding-left: calc(1.5rem + 7px);
`

const FormGroup = styled(StandardForm.Group)`
  &&& {
    display: flex;
    align-items: flex-end;
    width: 100%;
    margin-top: 10px;
    padding-top: 2rem;
  }
`

const FormTextArea = styled(StandardForm.Field)`
  &&& {
    width: 100%;
  }
`

const MarkAsResolvedWrapper = styled.div`
  padding-left: 1rem;
`

export default class AnswerForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      answer: '',
    }
  }

  answerChangeHandler = (e, { value }) => {
    this.setState({ answer: value })
  }

  answerClick = (id, pushToMemberHistory) => {
    if (this.state.answer.trim().length) {
      this.props.sendAnswer({ msg: this.state.answer, id })
      pushToMemberHistory(id)
    }
  }

  doneClick = (id) => {
    this.props.sendDoneMsg({ id })
  }

  render() {
    const { memberId, redirectClick, error } = this.props
    return (
      <MemberHistoryContext.Consumer>
        {({ pushToMemberHistory }) => (
          <>
            <Form>
              <FormGroup>
                <FormTextArea
                  control={TextArea}
                  placeholder="Write reply..."
                  onChange={this.answerChangeHandler}
                  value={this.state.answer}
                  rows={1}
                />
                <div>
                  <Button
                    content="Send"
                    onClick={this.answerClick.bind(
                      this,
                      memberId,
                      pushToMemberHistory,
                    )}
                    primary
                    disabled={!this.state.answer.trim().length}
                  />
                </div>
              </FormGroup>
              <MarkAsResolvedWrapper>
                <Checkbox
                  label="Mark as resolved"
                  onClick={this.doneClick.bind(this, memberId)}
                />
              </MarkAsResolvedWrapper>
              {error ? <Message negative>{error}</Message> : null}
            </Form>
          </>
        )}
      </MemberHistoryContext.Consumer>
    )
  }
}

AnswerForm.propTypes = {
  memberId: PropTypes.string.isRequired,
  sendAnswer: PropTypes.func.isRequired,
  sendDoneMsg: PropTypes.func.isRequired,
  redirectClick: PropTypes.func.isRequired,
  error: PropTypes.string,
}
