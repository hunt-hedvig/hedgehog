import styled from '@emotion/styled'
import { Button, Flex, Label, Modal, Shadowed, Spacing, Tabs } from '@hedvig-ui'
import chroma from 'chroma-js'
import { useMe } from 'features/user/hooks/use-me'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  GrantHolderType,
  ResourceAccessInformation,
  useGrantResourceAccessMutation,
  User,
  useResourceAccessInformationQuery,
} from 'types/generated/graphql'

const Footer = styled(Flex)`
  font-size: 0.85rem;
  margin-top: 0.2rem;
  padding: 1rem;
  color: ${({ theme }) =>
    chroma(theme.foreground)
      .alpha(0.7)
      .hex()};
`

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

const UserList: React.FC<{
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
                (restrictedUser) => restrictedUser.id === user.id,
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
      <Spacing top />
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

export const ResourceAccessOverview: React.FC<{
  onClose: () => void
  resourceId: string
}> = ({ onClose, resourceId }) => {
  const { data } = useResourceAccessInformationQuery({
    variables: { resourceId },
  })
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')

  const { me } = useMe()

  if (!data?.resourceAccess) {
    return null
  }

  const isUserThatRestricted =
    data.resourceAccess?.restrictedBy.email === me.email

  return (
    <Modal withoutHeader onClose={onClose}>
      <Tabs
        style={{ margin: '1rem 0', padding: '0rem 1rem' }}
        list={[
          {
            title: 'Users',
            action: () => {
              setActiveTab('users')
            },
            active: activeTab === 'users',
          },

          {
            title: 'Roles',
            action: () => {
              setActiveTab('roles')
            },
            active: activeTab === 'roles',
          },
        ]}
      />
      <Flex
        style={{
          width: '500px',
          height: '400px',
          padding: '0rem 1rem',
          overflowY: 'scroll',
        }}
        direction="column"
      >
        {activeTab === 'users' && (
          <UserList
            canGrant={isUserThatRestricted}
            resourceAccessInformation={data.resourceAccess}
            resourceId={resourceId}
          />
        )}
      </Flex>
      {!isUserThatRestricted && (
        <Footer justify="center" align="center">
          Only{' '}
          <Shadowed style={{ margin: '0 0.2rem' }}>
            {data.resourceAccess.restrictedBy.fullName}
          </Shadowed>{' '}
          can grant access to new users
        </Footer>
      )}
    </Modal>
  )
}
