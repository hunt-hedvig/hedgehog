import Message from 'components/member/messages/Message'
import PropTypes from 'prop-types'
import React from 'react'
import { Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useMemberNameAndContractMarketInfoQuery } from 'api/generated/graphql'
import styled from 'react-emotion'
import { getMemberFlag, getMemberIdColor } from 'utils/member'

const QuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1.5rem;
  border-left: 7px solid ${({ memberId }) => getMemberIdColor(memberId)};
`

const MemberInfoWrapper = styled.div`
  font-size: 1.5rem;
  padding-bottom: 1rem;
`

const Question = ({ activeList, question }) => {
  const memberQuery = useMemberNameAndContractMarketInfoQuery({
    variables: { memberId: question.memberId },
  })

  const memberDataMaybe = memberQuery?.data?.member
  return (
    <QuestionWrapper memberId={question.memberId}>
      <MemberInfoWrapper>
        {memberDataMaybe ? (
          <>
            {memberDataMaybe?.firstName} {memberDataMaybe?.lastName}{' '}
            {getMemberFlag(memberDataMaybe?.contractMarketInfo?.market)},{' '}
          </>
        ) : null}
        <Link to={`/members/${question.memberId}`}>{question.memberId}</Link>
      </MemberInfoWrapper>

      {activeList[question.memberId] &&
        activeList[question.memberId].map((data) => (
          <div key={data.id}>
            <Message
              content={data.message.body}
              left={data.answer}
              isQuestionMessage={true}
              timestamp={data.localDate}
              from={null}
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
