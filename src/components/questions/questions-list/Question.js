import Message from 'components/member/messages/Message'
import * as PropTypes from 'prop-types'
import React from 'react'
import { Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useMemberNameQuery } from 'api/generated/graphql'
import styled from 'react-emotion'
import { getMemberIdColor } from 'utils/member'

const QuestionWrapper = styled('div')(({ memberId }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '1rem',
  borderLeft: '7px solid ' + getMemberIdColor(memberId),
}))

const Question = ({ activeList, question }) => {
  const memberNameQuery = useMemberNameQuery({
    variables: { memberId: question.memberId },
  })

  const graphqlMemberDataMaybe = memberNameQuery?.data?.member
  return (
    <QuestionWrapper memberId={question.memberId}>
      <Header>
        Questions from:{' '}
        <Link to={`/members/${question.memberId}`}>
          {question.memberId}
          {graphqlMemberDataMaybe
            ? ` ${graphqlMemberDataMaybe?.firstName} ${graphqlMemberDataMaybe?.lastName}`
            : ''}
        </Link>
      </Header>
      {activeList[question.memberId] &&
        activeList[question.memberId].map((data) => (
          <div key={data.id}>
            <Message
              content={data.message.body}
              left={data.answer}
              isQuestionMessage={true}
              timestamp={data.localDate}
              from={question.memberId}
            />
            {data.answer ? (
              <Message
                content={data.answer.body}
                left={true}
                isQuestionMessage={false}
                timestamp={data.localAnswerDate}
                from={this.getSender(data)}
              />
            ) : null}
          </div>
        ))}
    </QuestionWrapper>
  )
}

Question.propTypes = {
  question: PropTypes.object.isRequired,
  membersList: PropTypes.array,
  activeList: PropTypes.object,
}

export default Question
