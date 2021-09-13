import styled from '@emotion/styled'
import { Button, Popover } from '@hedvig-ui'
import React from 'react'
import { ShieldShaded } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { hasOpenClaim } from 'utils/claim'
import { getMemberFlag, getMemberIdColor } from 'utils/member'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'
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

const StyledPopover = styled(Popover)`
  font-size: 1rem;
  vertical-align: middle;
`

const MemberInfoWrapper = styled.div`
  font-size: 1.5rem;
  padding-bottom: 1rem;
`

export const QuestionGroupInfo = ({ questionGroup }) => {
  const member = questionGroup?.member

  const { numberMemberGroups } = useNumberMemberGroups()
  const history = useHistory()

  return (
    <QuestionGroupInfoWrapper
      memberId={questionGroup.memberId}
      numberMemberGroups={numberMemberGroups}
    >
      <MemberInfoWrapper>
        {member && (
          <>
            {hasOpenClaim(member.claims) && (
              <StyledPopover
                contents={
                  <>
                    {member.claims.length > 1
                      ? 'Member has multiple open claims'
                      : 'Go to claim'}
                  </>
                }
              >
                <Button
                  variation={'icon'}
                  disabled={member.claims.length > 1}
                  onClick={() => history.push(`/claims/${member.claims[0].id}`)}
                  color={'primary'}
                  size={'large'}
                  style={{ padding: '0em', marginRight: '1em' }}
                >
                  <ShieldShaded />
                </Button>
              </StyledPopover>
            )}
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
