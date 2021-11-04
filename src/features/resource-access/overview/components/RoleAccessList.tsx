import styled from '@emotion/styled'
import { Button, Flex, Label, Spacing } from '@hedvig-ui'
import { AccessListItem } from 'features/resource-access/overview/components/AccessListItem'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  GrantHolderType,
  ResourceAccessInformation,
  useGrantResourceAccessMutation,
} from 'types/generated/graphql'

const ModalLabel = styled(Label)`
  font-size: 0.8rem;
`

export const RoleAccessList: React.FC<{
  resourceId: string
  resourceAccessInformation: ResourceAccessInformation
  canGrant: boolean
}> = ({ resourceId, resourceAccessInformation, canGrant }) => {
  const [grantClaimAccess] = useGrantResourceAccessMutation()

  const handleGrantAccess = (role: string) => {
    toast.promise(
      grantClaimAccess({
        variables: {
          resourceId,
          grantHolder: role,
          grantHolderType: GrantHolderType.Role,
        },
        optimisticResponse: {
          grantResourceAccess: {
            ...resourceAccessInformation,
            rolesGranted: [...resourceAccessInformation.rolesGranted, role],
            rolesRestricted: [
              ...resourceAccessInformation.rolesRestricted.filter(
                (restrictedRole) => restrictedRole !== role,
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
      {!!resourceAccessInformation.rolesGranted.length && (
        <ModalLabel>Access</ModalLabel>
      )}
      {resourceAccessInformation.rolesGranted.map((role, index) => (
        <AccessListItem
          access
          key={role}
          style={{ marginTop: !!index ? '0.5rem' : 0 }}
        >
          <Flex align="center" justify="space-between">
            {role}
          </Flex>
        </AccessListItem>
      ))}
      {!!resourceAccessInformation.rolesGranted.length && <Spacing top />}

      {!!resourceAccessInformation.rolesRestricted.length && (
        <ModalLabel>No access</ModalLabel>
      )}
      {resourceAccessInformation.rolesRestricted.map((role, index) => (
        <AccessListItem
          key={role}
          style={{ marginTop: !!index ? '0.5rem' : 0 }}
        >
          <Flex align="center" justify="space-between">
            {role}
            {canGrant && (
              <Button
                size="small"
                variant="tertiary"
                onClick={() => handleGrantAccess(role)}
              >
                Grant access
              </Button>
            )}
          </Flex>
        </AccessListItem>
      ))}
    </>
  )
}
