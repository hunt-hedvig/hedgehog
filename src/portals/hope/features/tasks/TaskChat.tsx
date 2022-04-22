import { ChatFill } from 'react-bootstrap-icons'
import { Button, Flex, HotkeyHint, Keys, Placeholder } from '@hedvig-ui'
import { MessagesList } from 'portals/hope/features/member/messages/MessagesList'
import { TaskChatInput } from 'portals/hope/features/tasks/components/TaskChatInput'
import React, { useState } from 'react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { useMemberHasOpenClaim } from 'portals/hope/common/hooks/use-member-has-open-claim'
import { Task } from 'types/generated/graphql'

const InChatTopNav = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  justify-content: space-between;
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: calc(100% - 2rem);
  z-index: 20;

  padding: 1rem 1.2rem;

  box-shadow: 0 0 1rem 0.15rem rgba(0, 0, 0, 0.1);

  border-radius: 0.5rem;

  background-color: ${({ theme }) => theme.backgroundLight};

  a {
    cursor: pointer;
  }

  .subtext {
    font-size: 0.9rem;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};
  }

  .icon {
    margin-right: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;

    background-color: ${({ theme }) => chroma(theme.accent).alpha(0.2).hex()};
    svg {
      fill: ${({ theme }) => theme.accent};
    }
  }
`

export const TaskChat: React.FC<{
  resolvable: boolean
  task: Task
  onResolve: () => void
  fullName?: string | null
  onSelectMember: (memberId: string, openClaimId: string | null) => void
  slim?: boolean
}> = ({ resolvable, task, onResolve, onSelectMember, slim }) => {
  const memberId = (task as { resource?: { memberId?: string } })?.resource
    ?.memberId

  const openClaim = useMemberHasOpenClaim(memberId)
  const [isLarge, setIsLarge] = useState(false)

  return (
    <>
      <InChatTopNav
        onClick={() =>
          memberId && onSelectMember(memberId, openClaim?.id ?? null)
        }
      >
        <Flex align="center">
          <div className="icon">
            <ChatFill />
          </div>
          <div>
            <a
              onClick={() =>
                memberId && onSelectMember(memberId, openClaim?.id ?? null)
              }
            >
              {task.title ?? <Placeholder>Not available</Placeholder>}
            </a>
          </div>
        </Flex>
        {resolvable && (
          <HotkeyHint
            text="Mark as resolved"
            keys={[Keys.Command, Keys.Shift, Keys.Enter]}
            position="bottom"
          >
            <Button
              disabled={!resolvable}
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                onResolve()
              }}
            >
              Mark as resolved
            </Button>
          </HotkeyHint>
        )}
      </InChatTopNav>
      {memberId && (
        <>
          <div
            style={{
              height: isLarge ? 'calc(100% - 27rem)' : 'calc(100% - 15rem)',
              transition: 'height 200ms',
            }}
          >
            <MessagesList
              memberId={memberId}
              style={{
                padding: '2rem',
                marginBottom: '6rem',
                paddingBottom: '0',
              }}
            />
          </div>
          <div
            style={{
              padding: '1rem',
              overflow: 'hidden',
            }}
          >
            {memberId && (
              <TaskChatInput
                onResize={() => setIsLarge(!isLarge)}
                isLarge={isLarge}
                memberId={memberId}
                onBlur={() => void 0}
                onFocus={() => void 0}
                onResolve={onResolve}
                slim={slim}
              />
            )}
          </div>
        </>
      )}
    </>
  )
}
