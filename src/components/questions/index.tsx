import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header } from 'semantic-ui-react'
import QuestionsList from './questions-list/QuestionsList'

export default class Questions extends React.Component {
  constructor(props) {
    super(props)
  }

  public tabChange = () => {
    this.props.questionsRequest()
  }

  public componentDidMount() {
    this.props.questionsRequest()
    this.props.membersRequest()
  }

  public render() {
    const {
      questions,
      members: { list },
      sendAnswer,
      sendDoneMsg,
    } = this.props
    return (
      <React.Fragment>
        <Header size="huge">Questions</Header>
        <QuestionsList
          questions={questions.list}
          sendAnswer={sendAnswer}
          sendDoneMsg={sendDoneMsg}
          tabChange={this.tabChange}
          members={list}
        />
      </React.Fragment>
    )
  }
}

Questions.propTypes = {
  members: PropTypes.object.isRequired,
  questions: PropTypes.object.isRequired,
  membersRequest: PropTypes.func.isRequired,
  questionsRequest: PropTypes.func.isRequired,
  sendAnswer: PropTypes.func.isRequired,
  sendDoneMsg: PropTypes.func.isRequired,
}
