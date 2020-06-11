import Pagination from 'components/shared/pagination/Pagination'
import PropTypes from 'prop-types'
import React from 'react'
import { Header, Segment } from 'semantic-ui-react'
import { history } from 'store'
import styled from 'react-emotion'
import AnswerForm from './AnswerForm'
import AnswerInfo from './AnswerInfo'
import Question from './Question'

const List = styled(Segment)`
  &&& {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
`

const MemberQuestionItem = styled.div`
  padding: 3rem 1.5rem;
  margin-left: -1.5rem;
  margin-bottom: 3rem;
  margin-right: 3rem;
  border-radius: 0.5rem;
  max-width: 50rem;
  width: 50%;

  background: ${({ theme }) => theme.accentLighter};
  border: 1px solid ${({ theme }) => theme.border};
`

export default class SortedList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeList: {},
      answer: '',
    }
  }

  onChangePage = (listId, list) => {
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      this.setState({
        activeList: {
          ...this.state.activeList,
          [listId]: list,
        },
      })
    })
  }

  getSender = (data) =>
    data.personnel && data.personnel.email ? `${data.personnel.email}` : 'admin'

  chatRedirectClick = (id) => {
    history.push(`/members/${id}`)
  }

  render() {
    const { list, members, sendAnswer, sendDoneMsg } = this.props
    const { activeList } = this.state
    return (
      <List>
        {list.length ? (
          <React.Fragment>
            {list.map((question) => (
              <MemberQuestionItem key={question.id}>
                <Question activeList={activeList} question={question} />
                {!question.answer && question.answer !== '' ? (
                  <AnswerForm
                    memberId={question.memberId}
                    sendAnswer={sendAnswer}
                    sendDoneMsg={sendDoneMsg}
                    redirectClick={this.chatRedirectClick}
                    error={question.error}
                  />
                ) : (
                  <AnswerInfo
                    member={question}
                    redirectClick={this.chatRedirectClick}
                  />
                )}
                <Pagination
                  items={question.questions}
                  onChangePage={this.onChangePage.bind(this, question.memberId)}
                  pageSize={10}
                />
              </MemberQuestionItem>
            ))}
          </React.Fragment>
        ) : (
          <Header>List is empty</Header>
        )}
      </List>
    )
  }
}

SortedList.propTypes = {
  list: PropTypes.array.isRequired,
  sendAnswer: PropTypes.func.isRequired,
  sendDoneMsg: PropTypes.func.isRequired,
  members: PropTypes.array,
}
