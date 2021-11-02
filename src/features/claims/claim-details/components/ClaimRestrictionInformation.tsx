import styled from '@emotion/styled'
import { Button, Flex, Modal, Shadowed, Tabs } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import chroma from 'chroma-js'
import { useMe } from 'features/user/hooks/use-me'
import React, { useState } from 'react'
import { ShieldLockFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  ClaimPageDocument,
  ClaimPageQuery,
  ClaimRestriction,
  useGrantClaimAccessMutation,
  User,
  useReleaseClaimAccessMutation,
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
  margin-top: 0.5rem;
  background-color: ${({ theme, access = false }) =>
    access ? theme.accentLighter : theme.backgroundTransparent};
  color: ${({ theme, access }) => (access ? theme.accent : theme.foreground)};
  padding: 0.5em 0.9em;
  border-radius: 6px;
  width: 100%;

  :first-of-type {
    margin-top: 0;
  }
`

const ClaimRestrictionModal: React.FC<{
  onClose: () => void
  restriction: ClaimRestriction
  claimId: string
}> = ({ onClose, restriction, claimId }) => {
  const [activeTab, setActiveTab] = useState<'access' | 'no_access'>('access')
  const { data } = useUsersQuery()
  const [grantClaimAccess] = useGrantClaimAccessMutation()
  const { me } = useMe()

  const isUserThatRestricted = restriction.restrictedBy.email === me.email

  const users = data?.users ?? []

  const usersWithoutAccess = users.filter(
    (user) =>
      !restriction.grantedAccess.some(
        (grantedUser) => grantedUser.email === user.email,
      ),
  )

  const handleGrantAccess = (user: User) => {
    toast.promise(
      grantClaimAccess({
        variables: { claimId, email: user.email },
        optimisticResponse: {
          grantClaimAccess: {
            __typename: 'UserClaimAccess',
            id: 'temp-id',
            claim: {
              id: claimId,
            },
            grantedTo: {
              __typename: 'User',
              id: user.id,
              email: user.email,
              fullName: user.fullName,
            },
            grantedBy: {
              __typename: 'User',
              id: 'temp-me-id',
              email: me.email,
              fullName: me.fullName,
            },
          },
        },
        update: (cache, { data: response }) => {
          if (!response?.grantClaimAccess) {
            return
          }

          const cachedData = cache.readQuery({
            query: ClaimPageDocument,
            variables: {
              claimId,
            },
          }) as ClaimPageQuery

          if (!cachedData.claim?.restriction?.grantedAccess) {
            return
          }

          cache.writeQuery({
            query: ClaimPageDocument,
            data: {
              claim: {
                ...cachedData.claim,
                restriction: {
                  ...cachedData.claim.restriction,
                  grantedAccess: [
                    ...cachedData.claim.restriction.grantedAccess,
                    response.grantClaimAccess.grantedTo,
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
            title: 'Users with access',
            action: () => {
              setActiveTab('access')
            },
            active: activeTab === 'access',
          },

          {
            title: 'Users without access',
            action: () => {
              setActiveTab('no_access')
            },
            active: activeTab === 'no_access',
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
        {activeTab === 'access' &&
          restriction.grantedAccess.map((user) => (
            <UserItem access key={user.id}>
              {user.fullName}
            </UserItem>
          ))}

        {activeTab === 'no_access' &&
          usersWithoutAccess.map((user) => (
            <UserItem key={user.id}>
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
  restriction: ClaimRestriction
  claimId: string
}> = ({ restriction, claimId }) => {
  const [showModal, setShowModal] = useState(false)
  const { confirm } = useConfirmDialog()
  const [releaseClaimAccess] = useReleaseClaimAccessMutation()

  const handleReleaseAccess = () => {
    toast.promise(
      releaseClaimAccess({
        variables: { claimId },
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
        <ClaimRestrictionModal
          restriction={restriction}
          onClose={() => setShowModal(false)}
          claimId={claimId}
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
                  Only users that have been granted access will be able to see
                  this claim
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
