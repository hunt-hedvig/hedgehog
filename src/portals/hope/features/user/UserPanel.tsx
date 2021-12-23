import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import { useClickOutside } from '@hedvig-ui/hooks/use-click-outside'
import { colorsV3 } from '@hedviginsurance/brand'
import chroma from 'chroma-js'
import {
  differenceInSeconds,
  formatDistanceToNowStrict,
  parseISO,
} from 'date-fns'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router'
import { useUsersQuery } from 'types/generated/graphql'

const show = keyframes`
  from {
    right: -300px;
  }

  to {
    right: 0;
  }
`

const hide = keyframes`
  from {
    right: 0;
  }

  to {
    right: -300px;
  }
`

const Container = styled.div<{ closing: boolean }>`
  transition: right 400ms;

  position: fixed;
  top: 0;
  right: 0;

  width: 300px;
  height: 100%;

  background-color: ${({ theme }) =>
    theme.type === 'dark' ? colorsV3.gray800 : colorsV3.gray900};
  z-index: 1000;

  padding: 0 1.5em 2em;
  overflow-y: scroll;

  animation: ${({ closing }) => (closing ? hide : show)} 400ms;
`

const Label = styled.div`
  margin-top: 2em;
  color: ${({ theme }) => theme.placeholderColor};
  width: 100%;
  padding-bottom: 0.5rem;
  font-size: 0.85em;
  border-bottom: 1px solid
    ${({ theme }) => chroma(theme.semiStrongForeground).darken(1).hex()};
`

const UserItemContainer = styled.div`
  > div {
    margin-bottom: 0.5em;
    :first-of-type {
      margin-top: 1em;
    }
  }
`

const UserItem = styled.div<{ active?: boolean }>`
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

  * > .navigate-label {
    display: none;
  }

  * > .time-label {
    display: inline-block;
  }

  ${({ active, theme }) =>
    active &&
    css`
      cursor: pointer;
      transition: background-color 200ms;

      :hover {
        * > .navigate-label {
          display: inline-block;
        }

        * > .time-label {
          display: none;
        }

        background-color: ${theme.type === 'dark'
          ? chroma(colorsV3.gray900).brighten(0.5).hex()
          : chroma(colorsV3.gray800).brighten(0.5).hex()};
      }
    `};
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
  onClickOutside: () => void
  closing: boolean
}> = ({ closing, onClickOutside }) => {
  const history = useHistory()
  const panelRef = useRef<HTMLDivElement>(null)
  const { data, startPolling, stopPolling } = useUsersQuery()

  const { me } = useMe()

  useClickOutside(panelRef, onClickOutside)

  useEffect(() => {
    startPolling(1000)
    return () => stopPolling()
  }, [])

  const users = data?.users ?? []
  const now = new Date()

  const usersOnline = users
    .filter((user) =>
      user.latestPresence
        ? differenceInSeconds(now, parseISO(user.latestPresence)) <= 10
        : false,
    )
    .sort((u1, u2) =>
      u1.fullName.toLowerCase() > u2.fullName.toLowerCase() ? 1 : -1,
    )

  const usersOffline = users
    .filter((user) =>
      user.latestPresence
        ? differenceInSeconds(now, parseISO(user.latestPresence)) > 10
        : true,
    )
    .sort((u1, u2) => {
      if (!u1.latestPresence && u2.latestPresence) {
        return 1
      }

      if (u1.latestPresence && !u2.latestPresence) {
        return -1
      }

      if (!u1.latestPresence && !u2.latestPresence) {
        return 0
      }

      return u1.latestPresence < u2.latestPresence ? 1 : -1
    })

  return (
    <Container closing={closing} ref={panelRef}>
      <Label>Users online</Label>
      <UserItemContainer>
        {usersOnline.map((user) => {
          const hasCurrentLocation =
            !!user.latestLocation && user.email !== me.email

          return (
            <UserItem
              onClick={() =>
                hasCurrentLocation &&
                user.latestLocation &&
                history.push(user.latestLocation)
              }
              active={hasCurrentLocation}
              key={user.id}
            >
              <Flex direction="column">
                <UserName>{user.fullName}</UserName>
                <LatestSeenLabel>
                  <span className="navigate-label">Go to location</span>
                  <span className="time-label">Active now</span>
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
                <Flex direction="column">
                  <UserName>{user.fullName}</UserName>
                  <LatestSeenLabel>
                    {user.latestPresence
                      ? formatDistanceToNowStrict(
                          parseISO(user.latestPresence),
                          {
                            addSuffix: true,
                          },
                        )
                      : 'Has never signed in'}
                  </LatestSeenLabel>
                </Flex>
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
