import styled from '@emotion/styled'
import { Button, Flex, Shadowed } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import chroma from 'chroma-js'
import { ResourceAccessOverview } from 'features/resource-access/ResourceAccessOverview'
import React, { useState } from 'react'
import { ShieldLockFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  ClaimPageDocument,
  ClaimPageQuery,
  ResourceAccessInformation,
  useReleaseResourceAccessMutation,
} from 'types/generated/graphql'

const Subtext = styled.span`
  font-size: 0.85rem;
  margin-top: 0.2rem;
  color: ${({ theme }) =>
    chroma(theme.foreground)
      .alpha(0.7)
      .hex()};
`

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
        <ResourceAccessOverview
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
