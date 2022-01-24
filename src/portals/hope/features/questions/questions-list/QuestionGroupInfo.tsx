import styled from '@emotion/styled'
import {
  getMemberFlag,
  getMemberIdColor,
} from 'portals/hope/features/member/utils'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import React from 'react'
import { Link } from 'react-router-dom'
import { QuestionInfo } from './QuestionInfo'
import { QuestionGroup } from 'types/generated/graphql'
import { PickedLocale } from 'portals/hope/features/config/constants'

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

export const QuestionGroupInfo = ({ group }: { group: QuestionGroup }) => {
  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <QuestionGroupInfoWrapper
      memberId={group.memberId}
      numberMemberGroups={numberMemberGroups}
    >
      <MemberInfoWrapper>
        {group.firstName} {group.lastName}{' '}
        {group.market &&
          getMemberFlag(
            { market: group.market },
            group.pickedLocale as PickedLocale,
          )}{' '}
        <Link to={`/members/${group.memberId}`}>{group.memberId}</Link>
      </MemberInfoWrapper>

      {group.questions.map((question) => {
        return <QuestionInfo key={question.id} question={question} />
      })}
    </QuestionGroupInfoWrapper>
  )
}
