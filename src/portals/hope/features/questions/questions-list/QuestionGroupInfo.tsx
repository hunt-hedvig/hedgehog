import styled from '@emotion/styled'
import {
  getMemberFlag,
  getMemberIdColor,
} from 'portals/hope/features/member/utils'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import React from 'react'
import { Link } from 'react-router-dom'
import { QuestionInfo } from './QuestionInfo'

const QuestionGroupInfoWrapper = styled.div<{
  memberId: string
  numberMemberGroups: number
}>`
  display: flex;
  flex-direction: column;
  padding-left: 1.5rem;
  border-left: 7px solid
    ${({ memberId, numberMemberGroups }) =>
      getMemberIdColor(memberId, numberMemberGroups)};
`

const MemberInfoWrapper = styled.div`
  font-size: 1.5rem;
  padding-bottom: 1rem;
`

export const QuestionGroupInfo = ({ questionGroup }) => {
  const member = questionGroup?.member

  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <QuestionGroupInfoWrapper
      memberId={questionGroup.memberId}
      numberMemberGroups={numberMemberGroups}
    >
      <MemberInfoWrapper>
        {member && (
          <>
            {member?.firstName} {member?.lastName}{' '}
            {getMemberFlag(member?.contractMarketInfo, member.pickedLocale)}{' '}
          </>
        )}
        <Link to={`/members/${questionGroup.memberId}`}>
          {questionGroup.memberId}
        </Link>
      </MemberInfoWrapper>

      {questionGroup.questions.map((question) => {
        return <QuestionInfo key={question.id} question={question} />
      })}
    </QuestionGroupInfoWrapper>
  )
}
