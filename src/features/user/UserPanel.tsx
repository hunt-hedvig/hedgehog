import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import { useClickOutside } from '@hedvig-ui/utils/click-outside'
import { colorsV3 } from '@hedviginsurance/brand'
import chroma from 'chroma-js'
import { differenceInMinutes, parseISO } from 'date-fns'
import React, { useEffect, useRef } from 'react'
import { useUsersQuery } from 'types/generated/graphql'

const Container = styled.div<{ visible: boolean }>`
  transition: right 400ms;

  position: fixed;
  top: 0;
  right: ${({ visible }) => (visible ? '0' : '-300px')};

  width: 300px;
  height: 100%;

  background-color: ${({ theme }) =>
    theme.type === 'dark' ? colorsV3.gray800 : colorsV3.gray900};
  z-index: 1000;

  padding: 0 1.5em 2em;
  overflow-y: scroll;
`

const Label = styled.div`
  margin-top: 2em;
  color: ${({ theme }) => theme.placeholderColor};
  width: 100%;
  padding-bottom: 0.5rem;
  font-size: 0.85em;
  border-bottom: 1px solid
    ${({ theme }) =>
      chroma(theme.semiStrongForeground)
        .darken(1)
        .hex()};
`

const UserItemContainer = styled.div`
  > div {
    margin-bottom: 0.5em;
    :first-of-type {
      margin-top: 1em;
    }
  }
`

const UserItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: white;
  background-color: ${({ theme }) =>
    theme.type === 'dark' ? colorsV3.gray900 : colorsV3.gray800};
  border-radius: 8px;
  max-width: 100%;
  background-color: ${({ theme }) =>
    theme.type === 'dark' ? colorsV3.gray900 : colorsV3.gray800};
  padding: 0.7rem 1rem;
`

const UserName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
`

type UserStatus = 'online' | 'away' | 'offline'

const UserStatusOrb = styled.div<{ status: UserStatus }>`
  width: 14px;
  height: 14px;
  background-color: ${({ theme, status }) =>
    status === 'online'
      ? theme.success
      : status === 'away'
      ? theme.accent
      : theme.placeholderColor};
  border-radius: 50%;
  margin-left: 1rem;
`

const LatestSeenLabel = styled.span`
  color: ${({ theme }) => theme.placeholderColor};
  font-size: 0.8rem;
`

export const UserPanel: React.FC<{
  visible: boolean
  onClickOutside: () => void
}> = ({ visible, onClickOutside }) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const { data, startPolling, stopPolling } = useUsersQuery()

  useClickOutside(panelRef, onClickOutside)

  useEffect(() => {
    if (visible) {
      startPolling(1000)
    } else {
      stopPolling()
    }
  }, [visible])

  const users = data?.users ?? []
  const now = new Date()

  const usersOnline = users
    .filter((user) =>
      user.latestPresence
        ? differenceInMinutes(now, parseISO(user.latestPresence)) <= 30
        : false,
    )
    .sort((u1, u2) =>
      differenceInMinutes(now, parseISO(u1.latestPresence)) >
      differenceInMinutes(now, parseISO(u2.latestPresence))
        ? 1
        : -1,
    )

  const usersOffline = users.filter((user) =>
    user.latestPresence
      ? differenceInMinutes(now, parseISO(user.latestPresence)) > 30
      : true,
  )

  return (
    <Container visible={visible} ref={panelRef}>
      <Label>Users online</Label>
      <UserItemContainer>
        {usersOnline.map((user) => {
          const differenceLatestPresence = differenceInMinutes(
            now,
            parseISO(user.latestPresence),
          )

          return (
            <UserItem key={user.id}>
              <Flex direction="column">
                <UserName>{user.fullName}</UserName>
                <LatestSeenLabel>
                  {user.latestPresence && differenceLatestPresence > 0
                    ? `${differenceLatestPresence} min ago`
                    : 'Active now'}
                </LatestSeenLabel>
              </Flex>
              <div>
                <UserStatusOrb status="online" />
              </div>
            </UserItem>
          )
        })}
      </UserItemContainer>
      {!!usersOffline.length && (
        <>
          <Label>Users offline</Label>
          <UserItemContainer>
            {usersOffline.map((user) => (
              <UserItem key={user.id}>
                <UserName>{user.fullName}</UserName>
                <div>
                  <UserStatusOrb status="offline" />
                </div>
              </UserItem>
            ))}
          </UserItemContainer>
        </>
      )}
    </Container>
  )
}
