import React from 'react'
import { Question, QuestionGroup } from 'types/generated/graphql'
import { useMemberHasOpenClaim } from 'portals/hope/common/hooks/use-member-has-open-claim'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import {
  getMemberFlag,
  getMemberIdColor,
} from 'portals/hope/features/member/utils'
import { PickedLocale } from 'portals/hope/features/config/constants'
import { Placeholder } from '@hedvig-ui'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import chroma from 'chroma-js'
import { useTaskNavigation } from 'portals/hope/features/tasks/hooks/use-tasks'

const getQuestionBody = (question: Question) => {
  try {
    return JSON.parse(question.messageJsonString).body
  } catch (e) {
    return ''
  }
}

const ListItem = styled(motion.li)<{ selected?: boolean }>`
  display: flex;
  font-size: 1.1rem;
  padding: 1.75rem 2.05rem;
  cursor: pointer;

  transition: background-color 200ms;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.accent).alpha(0.2).brighten(2).hex()};
  }

  background-color: ${({ selected, theme }) =>
    selected ? chroma(theme.accent).alpha(0.2).brighten(1).hex() : undefined};

  .orb {
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
  }

  .flag {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2rem;
    @media (max-width: 800px) {
      padding: 0 1.5rem;
    }
  }

  .name {
    width: 30%;

    @media (max-width: 800px) {
      width: 100%;
    }
    padding-right: 2rem;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    div {
      color: ${({ theme }) => theme.accent};
      transition: color 200ms;

      :hover {
        color: ${({ theme }) => theme.accentLight};
      }
    }
  }

  .preview {
    width: 90%;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .name-preview-container {
    display: flex;
    width: 100%;

    @media (max-width: 800px) {
      flex-direction: column;
      max-width: 60%;
    }
  }

  .options {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 10rem;
    @media (max-width: 800px) {
      width: 20%;
      min-width: 5rem;
      font-size: 0.75rem;
    }

    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};

    text-align: right;
  }
`

const getMemberName = (group: QuestionGroup) => {
  return group.firstName && group.lastName
    ? `${group.firstName} ${group.lastName}`
    : undefined
}

export const TaskListItem: React.FC<{
  disabled?: boolean
  group: QuestionGroup
  onClick: () => void
  selected: boolean
}> = ({ group, onClick, selected, disabled }) => {
  const { navigate } = useTaskNavigation()
  const openClaim = useMemberHasOpenClaim(group.memberId)
  const { numberMemberGroups } = useNumberMemberGroups()
  const previewQuestion = group?.questions?.slice(-1)[0] ?? ''
  const preview = getQuestionBody(previewQuestion)

  const orbColor = getMemberIdColor(group.memberId, numberMemberGroups)

  const flag = group.market
    ? getMemberFlag(
        {
          market: group.market ?? '',
        },
        group.pickedLocale as PickedLocale,
      )
    : '🏳'

  return (
    <ListItem
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      key={group.id}
      onClick={() => !disabled && onClick()}
      selected={selected}
    >
      <div className="orb">
        <div style={{ backgroundColor: orbColor }} />
      </div>
      <div className="flag">{flag}</div>
      <div className="name-preview-container">
        <span className="name">
          {getMemberName(group) ? (
            <div
              onClick={() => {
                if (disabled) return
                if (openClaim) {
                  navigate({
                    memberId: group.memberId,
                    tab: 'claims',
                    claimIds: openClaim.id,
                    active: openClaim.id,
                  })
                } else {
                  navigate({
                    memberId: group.memberId,
                    active: group.memberId,
                  })
                }
                onClick()
              }}
            >
              {getMemberName(group)}
            </div>
          ) : (
            <Placeholder>Name not available</Placeholder>
          )}
        </span>
        <span className="preview">{preview.text}</span>
      </div>
      <div className="options">
        {formatDistanceToNowStrict(parseISO(previewQuestion.timestamp), {
          addSuffix: true,
        })}
      </div>
    </ListItem>
  )
}
