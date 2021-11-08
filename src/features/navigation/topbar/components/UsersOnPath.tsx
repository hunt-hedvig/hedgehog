import styled from '@emotion/styled'
import { Flex, withFadeIn } from '@hedvig-ui'
import chroma from 'chroma-js'
import { differenceInSeconds, parseISO } from 'date-fns'
import { useMe } from 'features/user/hooks/use-me'
import React from 'react'
import { useLocation } from 'react-router'
import { useUsersOnPathQuery } from 'types/generated/graphql'

const CircleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;

  :first-of-type {
    margin-left: 1.5rem;
  }

  :hover {
    .user-info {
      transition: all 250ms ease-in-out;
      width: 125px;
      opacity: 1;
      visibility: visible;
      margin-left: 0.5rem;
      margin-right: 1rem;
    }
  }

  .user-info {
    transition: all 250ms ease-in-out;
    width: 0;
    opacity: 0;
    visibility: hidden;
    margin-left: 0;
    margin-right: 0;
  }
`

const UserInfo = styled.div`
  text-align: left;
  color: ${({ theme }) => theme.placeholderColor};
  font-weight: normal;
  font-size: 0.9rem;
`

const UserCircle = withFadeIn(styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 2.8rem;
  width: 2.8rem;
  border-radius: 50%;

  margin-left: 0.5rem;

  color: ${({ theme }) => theme.accentContrast};
  font-weight: bold;
  font-size: 1.2rem;

  background-color: ${({ theme }) =>
    chroma(theme.accent)
      .brighten(1)
      .hex()};
`)

export const UsersOnPath: React.FC<{}> = () => {
  const location = useLocation()
  const { me } = useMe()
  const { data } = useUsersOnPathQuery({
    variables: { path: location.pathname },
    pollInterval: 3000,
  })

  const now = new Date()
  const users = (data?.usersOnPath ?? [])
    .filter((user) =>
      user.latestPresence
        ? differenceInSeconds(now, parseISO(user.latestPresence)) <= 10
        : false,
    )
    .filter((user) => user.email !== me.email)

  return (
    <Flex direction="row">
      {users.map((user, index) => {
        const signature = user.fullName
          .split(' ')
          .map((name) => name[0].toUpperCase())

        return (
          <CircleContainer key={user.email}>
            <UserCircle delay={`${index * 40}ms`} duration={300}>
              {signature}
            </UserCircle>
            <UserInfo className="user-info">{user.email}</UserInfo>
          </CircleContainer>
        )
      })}
    </Flex>
  )
}
