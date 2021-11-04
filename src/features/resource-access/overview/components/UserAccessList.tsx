import styled from '@emotion/styled'
import { Label, Spacing } from '@hedvig-ui'
import { AccessListItem } from 'features/resource-access/overview/components/Wrapper'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  GrantHolderType,
  ResourceAccessInformation,
  useGrantResourceAccessMutation,
  User,
} from 'types/generated/graphql'

const ModalLabel = styled(Label)`
  font-size: 0.8rem;
`

export const UserAccessList: React.FC<{
  resourceAccessInformation: ResourceAccessInformation
}> = ({ resourceAccessInformation }) => {
  const [grantClaimAccess] = useGrantResourceAccessMutation()

  const { resourceId, restrictedByMe } = resourceAccessInformation

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
        <AccessListItem key={user.id} access spacing={index !== 0}>
          {user.fullName}
        </AccessListItem>
      ))}

      {!!resourceAccessInformation.usersGranted.length && <Spacing top />}

      {!!resourceAccessInformation.usersRestricted.length && (
        <ModalLabel>No access</ModalLabel>
      )}

      {resourceAccessInformation.usersRestricted.map((user, index) => (
        <AccessListItem
          key={user.id}
          spacing={index !== 0}
          canGrant={restrictedByMe}
          onGrant={() => handleGrantAccess(user)}
        >
          {user.fullName}
        </AccessListItem>
      ))}
    </>
  )
}
