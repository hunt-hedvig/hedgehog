import styled from '@emotion/styled'
import { Button, Flex, Label, Modal, Shadowed, Spacing, Tabs } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import chroma from 'chroma-js'
import { useMe } from 'features/user/hooks/use-me'
import React, { useState } from 'react'
import { ShieldLockFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  ClaimPageDocument,
  ClaimPageQuery,
  GrantHolderType,
  ResourceAccessInformation,
  useGrantResourceAccessMutation,
  User,
  useReleaseResourceAccessMutation,
  useUsersQuery,
} from 'types/generated/graphql'

const Subtext = styled.span`
  font-size: 0.85rem;
  margin-top: 0.2rem;
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

const ResourceAccessModal: React.FC<{
  onClose: () => void
  restriction: ResourceAccessInformation
  resourceId: string
}> = ({ onClose, restriction, resourceId }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')
  const { data } = useUsersQuery()
  const [grantClaimAccess] = useGrantResourceAccessMutation()
  const { me } = useMe()

  const isUserThatRestricted = restriction.restrictedBy.email === me.email

  const users = data?.users ?? []

  const usersWithoutAccess = users.filter(
    (user) =>
      !restriction.usersGranted.some(
        (grantedUser) => grantedUser.email === user.email,
      ),
  )

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
            __typename: 'ResourceAccessGrant',
            id: 'temp-id',
            resourceId,
            grantHolder: user.id,
            grantHolderType: GrantHolderType.User,
            grantedBy: {
              __typename: 'User',
              id: 'temp-me-id',
              email: me.email,
              fullName: me.fullName,
            },
          },
        },
        update: (cache, { data: response }) => {
          if (!response?.grantResourceAccess) {
            return
          }

          const cachedData = cache.readQuery({
            query: ClaimPageDocument,
            variables: {
              claimId: resourceId,
            },
          }) as ClaimPageQuery

          if (!cachedData.claim?.restriction?.usersGranted) {
            return
          }

          cache.writeQuery({
            query: ClaimPageDocument,
            data: {
              claim: {
                ...cachedData.claim,
                restriction: {
                  ...cachedData.claim.restriction,
                  usersGranted: [
                    ...cachedData.claim.restriction.usersGranted,
                    user,
                  ],
                },
              },
            },
          })
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
          <>
            {!!restriction.usersGranted.length && (
              <ModalLabel>Access</ModalLabel>
            )}
            {restriction.usersGranted.map((user, index) => (
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
            {!!usersWithoutAccess.length && <ModalLabel>No access</ModalLabel>}
            {usersWithoutAccess.map((user, index) => (
              <UserItem
                key={user.id}
                style={{ marginTop: !!index ? '0.5rem' : 0 }}
              >
                <Flex align="center" justify="space-between">
                  {user.fullName}
                  {isUserThatRestricted && (
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
        )}
      </Flex>
      {!isUserThatRestricted && (
        <Flex
          style={{ padding: '1rem', fontSize: '0.8rem', opacity: 0.6 }}
          justify="center"
          align="center"
        >
          Only{' '}
          <Shadowed style={{ margin: '0 0.2rem' }}>
            {restriction.restrictedBy.fullName}
          </Shadowed>{' '}
          can grant access to new users
        </Flex>
      )}
    </Modal>
  )
}

export const ClaimRestrictionInformation: React.FC<{
  restriction: ResourceAccessInformation
  claimId: string
}> = ({ restriction, claimId }) => {
  const [showModal, setShowModal] = useState(false)
  const { confirm } = useConfirmDialog()
  const [releaseResourceAccess] = useReleaseResourceAccessMutation()

  const handleReleaseAccess = () => {
    toast.promise(
      releaseResourceAccess({
        variables: { resourceId: claimId },
        update: (cache) => {
          const cachedData = cache.readQuery({
            query: ClaimPageDocument,
            variables: {
              claimId,
            },
          }) as ClaimPageQuery

          cache.writeQuery({
            query: ClaimPageDocument,
            data: {
              claim: {
                ...cachedData.claim,
                restriction: null,
              },
            },
          })
        },
      }),
      {
        loading: 'Removing restriction',
        success: 'Restriction removed',
        error: 'Could not remove restriction',
      },
    )
  }

  return (
    <>
      {showModal && (
        <ResourceAccessModal
          restriction={restriction}
          onClose={() => setShowModal(false)}
          resourceId={claimId}
        />
      )}
      <Flex direction="row" align="center">
        <Flex
          style={{ fontSize: '1.5rem' }}
          align="center"
          justify="space-between"
        >
          <Flex align="center" direction="row">
            <ShieldLockFill />
            <div style={{ marginLeft: '1.5em' }}>
              <Flex direction="column">
                <span style={{ fontSize: '1rem' }}>
                  This claim has been marked as restricted by{' '}
                  <Shadowed>{restriction.restrictedBy.fullName}</Shadowed>
                </span>
                <Subtext>
                  Only users or roles that have been granted access will be able
                  to see this claim
                </Subtext>
              </Flex>
            </div>
          </Flex>
          <div>
            <Button variant="secondary" onClick={() => setShowModal(true)}>
              Manage access
            </Button>
            <Button
              variant="tertiary"
              onClick={() => {
                confirm(
                  'Are you sure you want to remove the restriction? Everybody will be able to see this claim',
                ).then(() => {
                  handleReleaseAccess()
                })
              }}
              style={{ marginLeft: '1em' }}
            >
              Remove restriction
            </Button>
          </div>
        </Flex>
      </Flex>
    </>
  )
}
