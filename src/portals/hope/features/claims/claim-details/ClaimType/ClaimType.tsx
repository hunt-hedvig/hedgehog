import { CardContent, CardTitle, Flex, SearchableDropdown } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { ClaimPropertyForm } from 'portals/hope/features/claims/claim-details/ClaimType/components/ClaimPropertyForm'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  useClaimPageQuery,
  useGetClaimTypesQuery,
  useSetClaimTypeMutation,
} from 'types/generated/graphql'

export const ClaimType: React.FC<{
  claimId: string
}> = ({ claimId }) => {
  const { data: claimTypeData } = useClaimPageQuery({
    variables: { claimId },
  })

  const { data, error } = useGetClaimTypesQuery()
  const [setClaimType] = useSetClaimTypeMutation()
  const claimTypes = data?.claimTypes ?? []
  const selectedClaimType = claimTypeData?.claim?.claimType

  const handleSetClaimType = (claimType: string) => {
    setClaimType({
      variables: { id: claimId, type: claimType },
      optimisticResponse: {
        setClaimType: {
          ...claimTypeData,
          __typename: 'Claim',
          id: claimId,
          claimType,
          events: claimTypeData?.claim?.events ?? [],
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
                propertySelections={
                  claimTypeData?.claim?.propertySelections ?? []
                }
              />
            )}
          </div>
        </Flex>
      </CardContent>
    </Flex>
  )
}
