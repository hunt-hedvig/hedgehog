import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import { StatusLine } from 'features/claims/claims-list/LargeClaimsList'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router'
import { QuestionGroup } from 'types/generated/graphql'

const Item = styled(Flex)<{ selected: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent : theme.backgroundTransparent};

  overflow: hidden;

  padding: 0 1em;
  margin-top: 0.5em;
  border-radius: 8px;
  max-width: 100%;
  width: 100%;
  height: 2em;

  position: relative;

  cursor: pointer;

  transition: all 300ms;

  display: flex;
  align-items: center;

  & span {
    font-size: 0.8em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: ${({ theme, selected }) =>
      selected ? theme.accentContrast : theme.semiStrongForeground};
  }

  :first-of-type {
    margin-top: 0.2em;
  }

  :hover {
    background-color: ${({ theme }) => theme.accentLight};
    color: ${({ theme }) => theme.accent};
  }
`

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  focus?: boolean
  group: QuestionGroup
  currentMemberId?: string
}

export const ConversationItem: React.FC<ItemProps> = ({
  focus,
  group,
  currentMemberId,
}) => {
  const { numberMemberGroups } = useNumberMemberGroups()

  const history = useHistory()

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focus && ref && ref.current) {
      ref.current.focus()
    }
  }, [focus])

  return (
    <Item
      ref={ref}
      key={group.memberId}
      tabIndex={0}
      onClick={() => history.push(`/conversations/${group.memberId}`)}
      selected={group.memberId === currentMemberId}
    >
      <span>
        {group.member?.firstName ?? ''} {group.member?.lastName ?? ' '}
      </span>
      <StatusLine
        numberMemberGroups={numberMemberGroups}
        memberId={group.memberId}
      />
    </Item>
  )
}
