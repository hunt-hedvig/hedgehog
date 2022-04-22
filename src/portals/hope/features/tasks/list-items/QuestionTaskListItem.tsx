import React from 'react'
import {
  TaskListItem,
  TaskListItemExtension,
} from 'portals/hope/features/tasks/list-items/TaskListItem'
import styled from '@emotion/styled'
import { QuestionGroup } from 'types/generated/graphql'
import { useMemberHasOpenClaim } from 'portals/hope/common/hooks/use-member-has-open-claim'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import {
  getMemberFlag,
  getMemberIdColor,
} from 'portals/hope/features/member/utils'
import { PickedLocale } from 'portals/hope/features/config/constants'
import { useTaskNavigation } from 'portals/hope/features/tasks/hooks/use-task-navigation'

const MemberOrb = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 3rem;

  div {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;

    background-color: transparent;
  }

  @media (max-width: 800px) {
    min-width: 1.5rem;
  }
`

const MemberFlag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
  @media (max-width: 800px) {
    padding: 0 1.5rem;
  }
`

export const QuestionTaskListItem: React.FC<
  TaskListItemExtension<QuestionGroup>
> = ({ task, ...props }) => {
  const { navigate } = useTaskNavigation()
  const questionGroup = task.resource
  const memberId = questionGroup.memberId

  const openClaim = useMemberHasOpenClaim(memberId)
  const { numberMemberGroups } = useNumberMemberGroups()

  const orbColor = memberId
    ? getMemberIdColor(memberId, numberMemberGroups)
    : 'transparent'

  const flag = questionGroup.market
    ? getMemberFlag(
        {
          market: questionGroup.market ?? '',
        },
        questionGroup.pickedLocale as PickedLocale,
      )
    : '🏳'

  return (
    <TaskListItem
      {...props}
      task={task}
      decorators={
        <>
          <MemberOrb>
            <div style={{ backgroundColor: orbColor }} />
          </MemberOrb>
          <MemberFlag>{flag}</MemberFlag>
        </>
      }
      onClickTitle={() => {
        if (openClaim) {
          navigate({
            memberId,
            tab: 'claims',
            claimIds: openClaim.id,
            active: openClaim.id,
            taskId: task.id,
          })
        } else {
          navigate({
            memberId: memberId,
            taskId: task.id,
            active: memberId,
          })
        }
      }}
    />
  )
}
