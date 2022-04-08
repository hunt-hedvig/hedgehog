import { CardContent, CardTitle, Flex, SearchableDropdown } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import { ClaimPropertyForm } from 'portals/hope/features/claims/claim-details/ClaimType/components/ClaimPropertyForm'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  useClaimTypeInformationQuery,
  useGetClaimTypesQuery,
  useSetClaimTypeMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'

gql`
  query ClaimTypeInformation($claimId: ID!) {
    claim(id: $claimId) {
      id
      claimType
      propertySelections {
        claimType
        property {
          id
          name
        }
        option {
          id
          name
        }
      }
    }
  }

  mutation SetClaimType($id: ID!, $type: String) {
    setClaimType(id: $id, type: $type) {
      id
      claimType
    }
  }

  mutation SetClaimPropertySelection(
    $id: ID!
    $claimType: String!
    $propertyId: ID!
    $optionIds: [ID!]!
  ) {
    setClaimPropertySelection(
      id: $id
      claimType: $claimType
      propertyId: $propertyId
      optionIds: $optionIds
    ) {
      id
      propertySelections {
        claimType
        property {
          id
          name
        }
        option {
          id
          name
        }
      }
    }
  }
`

export const ClaimType: React.FC<{
  claimId: string
}> = ({ claimId }) => {
  const { data: claimTypeInformation } = useClaimTypeInformationQuery({
    variables: { claimId },
  })

  const { data, error } = useGetClaimTypesQuery()
  const [setClaimType] = useSetClaimTypeMutation()
  const claimTypes = data?.claimTypes ?? []
  const selectedClaimType = claimTypeInformation?.claim?.claimType
  const propertySelections =
    claimTypeInformation?.claim?.propertySelections ?? []

  const handleSetClaimType = (claimType: string) => {
    PushUserAction('claim', 'update', 'type', claimType)
    setClaimType({
      variables: { id: claimId, type: claimType },
      optimisticResponse: {
        setClaimType: {
          __typename: 'Claim',
          id: claimId,
          claimType,
        },
      },
    }).catch(() => toast.error('Could not set type'))
  }

  return (
    <Flex direction="column">
      <CardContent>
        <Flex direction="column" justify="space-between">
          <div style={{ width: '100%' }}>
            <CardTitle
              title="Claim Type"
              badge={
                error
                  ? {
                      icon: BugFill,
                      status: 'danger',
                      label: 'Internal Error',
                    }
                  : null
              }
            />
            <SearchableDropdown
              value={
                selectedClaimType
                  ? {
                      value: selectedClaimType,
                      label: convertEnumToTitle(selectedClaimType),
                      searchTerms: selectedClaimType,
                    }
                  : null
              }
              placeholder="What type of claim is this?"
              isClearable={false}
              onChange={(selection) =>
                selection && handleSetClaimType(selection.value as string)
              }
              noOptionsMessage={() => 'No types found'}
              options={claimTypes.map((claimType) => ({
                value: claimType,
                label: convertEnumToTitle(claimType),
                searchTerms: claimType,
              }))}
            />
            {!!selectedClaimType && (
              <ClaimPropertyForm
                claimId={claimId}
                claimType={selectedClaimType}
                propertySelections={propertySelections}
              />
            )}
          </div>
        </Flex>
      </CardContent>
    </Flex>
  )
}
