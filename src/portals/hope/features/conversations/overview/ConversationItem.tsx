import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import { StatusLine } from 'portals/hope/features/claims/claims-list/LargeClaimsList'
import React, { useRef } from 'react'
import { useHistory } from 'react-router'
import { QuestionGroup } from 'types/generated/graphql'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'

const Item = styled(Flex)<{ selected: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent : theme.backgroundTransparent};

  overflow: hidden;

  padding: 0.5em 1em;
  margin-top: 0.5em;
  border-radius: 8px;
  max-width: 100%;
  width: 100%;
  outline: none;

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

const MemberName = styled.span<{ isPlaceholder: boolean }>`
  ${({ isPlaceholder, theme }) =>
    isPlaceholder &&
    css`
      color: ${theme.placeholderColor} !important;
    `};
`

interface ConversationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  group: QuestionGroup
  currentMemberId?: string
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  group,
  currentMemberId,
}) => {
  const { numberMemberGroups } = useNumberMemberGroups()

  const history = useHistory()

  const ref = useRef<HTMLDivElement>(null)

  const nameAvailable = group.firstName && group.lastName

  return (
    <Item
      ref={ref}
      key={group.memberId}
      tabIndex={0}
      onClick={() => history.push(`/conversations/${group.memberId}`)}
      selected={group.memberId === currentMemberId}
    >
      <MemberName isPlaceholder={!nameAvailable}>
        {nameAvailable
          ? group.firstName + ' ' + group.lastName
          : 'Name not available'}
      </MemberName>
      <StatusLine
        numberMemberGroups={numberMemberGroups}
        memberId={group.memberId}
      />
    </Item>
  )
}
