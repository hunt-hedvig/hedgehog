import styled from '@emotion/styled'
import { Button, Flex, Label, Spacing } from '@hedvig-ui'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  GrantHolderType,
  ResourceAccessInformation,
  useGrantResourceAccessMutation,
  User,
} from 'types/generated/graphql'

const UserItem = styled.div<{ access?: boolean }>`
  font-size: 1rem;
  background-color: ${({ theme, access = false }) =>
    access ? theme.accentLighter : theme.backgroundTransparent};
  color: ${({ theme, access }) => (access ? theme.accent : theme.foreground)};
  padding: 0.5em 0.9em;
  border-radius: 6px;
  width: 100%;
  margin-top: 0;
`

const ModalLabel = styled(Label)`
  font-size: 0.8rem;
`

export const UserAccessList: React.FC<{
  resourceId: string
  resourceAccessInformation: ResourceAccessInformation
  canGrant: boolean
}> = ({ resourceId, resourceAccessInformation, canGrant }) => {
  const [grantClaimAccess] = useGrantResourceAccessMutation()

  const handleGrantAccess = (user: User) => {
    toast.promise(
      grantClaimAccess({
        variables: {
          resourceId,
          grantHolder: user.id,
          grantHolderType: GrantHolderType.User,
        },
        optimisticResponse: {
          grantResourceAccess: {
            ...resourceAccessInformation,
            usersGranted: [...resourceAccessInformation.usersGranted, user],
            usersRestricted: [
              ...resourceAccessInformation.usersRestricted.filter(
                (restrictedUser) => restrictedUser.id !== user.id,
              ),
            ],
          },
        },
      }),
      {
        loading: 'Granting access',
        success: 'Access granted',
        error: 'Could not grant access',
      },
    )
  }

  return (
    <>
      {!!resourceAccessInformation.usersGranted.length && (
        <ModalLabel>Access</ModalLabel>
      )}
      {resourceAccessInformation.usersGranted.map((user, index) => (
        <UserItem
          access
          key={user.id}
          style={{ marginTop: !!index ? '0.5rem' : 0 }}
        >
          <Flex align="center" justify="space-between">
            {user.fullName}
          </Flex>
        </UserItem>
      ))}
      {!!resourceAccessInformation.usersGranted.length && <Spacing top />}

      {!!resourceAccessInformation.usersRestricted.length && (
        <ModalLabel>No access</ModalLabel>
      )}
      {resourceAccessInformation.usersRestricted.map((user, index) => (
        <UserItem key={user.id} style={{ marginTop: !!index ? '0.5rem' : 0 }}>
          <Flex align="center" justify="space-between">
            {user.fullName}
            {canGrant && (
              <Button
                size="small"
                variant="tertiary"
                onClick={() => handleGrantAccess(user)}
              >
                Grant access
              </Button>
            )}
          </Flex>
        </UserItem>
      ))}
    </>
  )
}
