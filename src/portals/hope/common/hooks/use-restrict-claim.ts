import gql from 'graphql-tag'
import {
  ClaimRestrictionFragment,
  ClaimRestrictionInformationDocument,
  useClaimRestrictionInformationQuery,
  useReleaseResourceAccessMutation,
  useRestrictResourceAccessMutation,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'

gql`
  mutation RestrictResourceAccess($claimId: ID!) {
    restrictResourceAccess(resourceId: $claimId) {
      resourceId
      usersGranted {
        id
        email
        fullName
        role
      }
      usersRestricted {
        id
        email
        fullName
        role
      }
      rolesGranted
      rolesRestricted
      restrictedBy {
        id
        email
        fullName
      }
      restrictedByMe
    }
  }

  query ClaimRestrictionInformation($claimId: ID!) {
    claim(id: $claimId) {
      id
      ...ClaimRestriction
    }
  }

  fragment ClaimRestriction on Claim {
    restriction {
      resourceId
      usersGranted {
        id
        email
        fullName
        role
      }
      usersRestricted {
        id
        email
        fullName
        role
      }
      rolesGranted
      rolesRestricted
      restrictedBy {
        id
        fullName
        email
      }
      restrictedByMe
    }
  }
`

interface UseRestrictClaimResult {
  restrict: () => void
  release: () => void
  restriction?: ClaimRestrictionFragment['restriction']
}

export const useRestrictClaim = (claimId: string): UseRestrictClaimResult => {
  const [releaseResourceAccess] = useReleaseResourceAccessMutation()
  const [restrictResourceAccess] = useRestrictResourceAccessMutation()
  const { data } = useClaimRestrictionInformationQuery({
    variables: { claimId },
  })

  const release = () => {
    PushUserAction('claim', 'delete', 'restriction', null)
    toast.promise(
      releaseResourceAccess({
        variables: { resourceId: claimId },
        update: (cache) => {
          cache.writeQuery({
            query: ClaimRestrictionInformationDocument,
            data: {
              claim: {
                __typename: 'Claim',
                id: claimId,
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

  const restrict = () => {
    PushUserAction('claim', 'create', 'restriction', null)
    toast.promise(
      restrictResourceAccess({
        variables: { claimId },
        update: (
          cache: ApolloCache<NormalizedCacheObject>,
          { data: response },
        ) => {
          if (!response) {
            return
          }

          cache.writeQuery({
            query: ClaimRestrictionInformationDocument,
            data: {
              claim: {
                __typename: 'Claim',
                id: claimId,
                restriction: response.restrictResourceAccess,
              },
            },
          })
        },
      }),
      {
        loading: 'Restricting access',
        success: 'Access restricted',
        error: 'Could not restrict access',
      },
    )
  }
  const restriction = data?.claim?.restriction

  return { restrict, release, restriction }
}
