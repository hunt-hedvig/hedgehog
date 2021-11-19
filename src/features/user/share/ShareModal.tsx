import styled from '@emotion/styled'
import { Button, Input, Modal, Spacing, ThirdLevelHeadline } from '@hedvig-ui'
import {
  isPressing,
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import chroma from 'chroma-js'
import { useMe } from 'features/user/hooks/use-me'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router'
import {
  User,
  useSharePathMutation,
  useUsersQuery,
} from 'types/generated/graphql'

const Container = styled.div`
  padding: 1rem;
`

// noinspection CssInvalidPropertyValue
const UserList = styled.div`
  margin-top: 1rem;
  max-height: calc(500px - 10.2rem);
  overflow-y: scroll;
  overflow: overlay;

  ::-webkit-scrollbar-track {
    border-radius: 0.5rem;
    background-color: transparent;
  }
`

const UserListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  border-radius: 6px;
  background-color: ${({ theme }) =>
    chroma(theme.accent)
      .alpha(0.1)
      .hex()};

  color: ${({ theme }) => theme.accent};

  margin-top: 0.75rem;
  font-size: 1rem;

  padding: 0.8rem 1.2rem;

  height: 3rem;
`

const SharedLabel = styled.div`
  font-size: 0.8rem;
  padding: 0.5rem 0.8rem;
`

export const ShareModal: React.FC<{
  onClose: () => void
}> = ({ onClose }) => {
  const { me } = useMe()
  const [filter, setFilter] = useState('')
  const { data } = useUsersQuery()
  const [sharedWith, setSharedWith] = useState<string[]>([])

  const [sharePath] = useSharePathMutation()

  const location = useLocation()

  useKeyIsPressed(Keys.Escape, onClose)

  const users =
    data?.users?.filter((user) => {
      if (user.email === me.email) {
        return false
      }

      if (!filter) {
        return true
      }

      return user.fullName.toLowerCase().includes(filter.toLowerCase())
    }) ?? []

  const handleShare = (user: Omit<User, 'notifications' | 'signature'>) => {
    setSharedWith((prev) => [...prev, user.id])
    toast.promise(
      sharePath({ variables: { path: location.pathname, userId: user.id } }),
      {
        loading: 'Sharing page',
        success: `Page shared with ${user.fullName.split(' ')[0]}`,
        error: 'Could not share page',
      },
    )
  }

  return (
    <Modal width="500px" height="500px" withoutHeader onClose={onClose}>
      <Container>
        <div>
          <ThirdLevelHeadline>Share page</ThirdLevelHeadline>
        </div>
        <Spacing top="medium" />
        <Input
          autoFocus
          muted
          size="medium"
          placeholder="Filter on name..."
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
        />
        <UserList>
          {users.map((user) => (
            <UserListItem
              key={user.id}
              tabIndex={0}
              onKeyDown={(e) => isPressing(e, Keys.Enter) && handleShare(user)}
            >
              <div>{user.fullName}</div>
              {sharedWith.includes(user.id) ? (
                <SharedLabel>Shared</SharedLabel>
              ) : (
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => handleShare(user)}
                >
                  Share
                </Button>
              )}
            </UserListItem>
          ))}
        </UserList>
      </Container>
    </Modal>
  )
}
