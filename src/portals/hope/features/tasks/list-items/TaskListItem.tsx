import React, { useEffect } from 'react'
import { Task, TaskResource } from 'types/generated/graphql'
import { Keys, Placeholder, useKeyIsPressed } from '@hedvig-ui'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import chroma from 'chroma-js'

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

  .name {
    min-width: 15rem;

    @media (max-width: 800px) {
      width: 100%;
    }
    padding-right: 2rem;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    max-width: 15rem;

    div {
      color: ${({ theme }) => theme.accent};
      transition: color 200ms;

      :hover {
        color: ${({ theme }) => theme.accentLight};
      }
    }
  }

  .preview {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .name-preview-container {
    display: flex;

    width: 75%;

    @media (max-width: 800px) {
      flex-direction: column;
      max-width: 60%;
    }
  }

  .options {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;

    white-space: nowrap;
    text-overflow: ellipsis;

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

interface TaskListItemTask<T> extends Omit<Task, 'resource'> {
  resource: T
}

interface TaskListItemProps<T extends TaskResource> {
  disabled?: boolean
  task: TaskListItemTask<T>
  onClick: () => void
  onClickTitle?: () => void
  selected: boolean
  decorators?: React.ReactNode
}

export type TaskListItemExtension<T extends TaskResource> = TaskListItemProps<T>
export type TaskWithResource<T extends TaskResource> = TaskListItemTask<T>
export type TaskWithoutResource = TaskListItemTask<TaskResource>

export const TaskListItem: React.FC<TaskListItemProps<TaskResource>> = ({
  task,
  onClick,
  selected,
  disabled,
  onClickTitle,
  decorators,
}) => {
  const isOptionPressed = useKeyIsPressed(Keys.Option)
  const isMPressed = useKeyIsPressed(Keys.M)

  useEffect(() => {
    if (isOptionPressed && isMPressed && !disabled && selected) {
      onClickTitle?.()
    }
  }, [isOptionPressed, isMPressed])

  return (
    <ListItem
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      key={task.id}
      onClick={() => !disabled && onClick()}
      selected={selected}
    >
      {decorators}
      <div className="name-preview-container">
        <span className="name">
          {task.title ? (
            <div
              onClick={(e) => {
                if (disabled) return
                onClickTitle?.()
                e.stopPropagation()
              }}
            >
              {task.title}
            </div>
          ) : (
            <Placeholder>Not available</Placeholder>
          )}
        </span>
        <span className="preview">{task.description}</span>
      </div>
      <div className="options">
        {formatDistanceToNowStrict(parseISO(task.createdAt), {
          addSuffix: true,
        })}
      </div>
    </ListItem>
  )
}
