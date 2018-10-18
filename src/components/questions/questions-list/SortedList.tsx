import Pagination from 'components/shared/pagination/Pagination'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header, Segment } from 'semantic-ui-react'
import { history } from 'store'
import styled from 'styled-components'
import AnswerForm from './AnswerForm'
import AnswerInfo from './AnswerInfo'
import Question from './Question'

const List = styled(Segment)`
  &&& {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 30px;
  }
`

const MemberQuestionItem = styled.div`
  border-bottom: solid 1px #22242626;
  padding: 10px 0;
`

export default class SortedList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeList: {},
      answer: '',
    }
  }

  public onChangePage = (listId, list) => {
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

  public getSender = (data) =>
    data.personnel && data.personnel.email ? `${data.personnel.email}` : 'admin'

  public chatRedirectClick = (id) => {
    history.push(`/members/${id}`)
  }

  public render() {
    const { list, members, sendAnswer, sendDoneMsg } = this.props
    const { activeList } = this.state
    return (
      <List>
        {list.length ? (
          <React.Fragment>
            {list.map((question) => (
              <MemberQuestionItem key={question.id}>
                <Question
                  activeList={activeList}
                  question={question}
                  membersList={members}
                />
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
