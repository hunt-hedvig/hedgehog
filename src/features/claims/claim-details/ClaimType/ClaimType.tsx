import {
  CardContent,
  CardTitle,
  Flex,
  SearchableDropdownWithRef,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { ClaimPropertyForm } from 'features/claims/claim-details/ClaimType/components/ClaimPropertyForm'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  useClaimPageQuery,
  useGetClaimTypesQuery,
  useSetClaimTypeMutation,
} from 'types/generated/graphql'

export const ClaimType: React.FC<{
  focus?: boolean
  claimId: string
}> = ({ claimId, focus }) => {
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
            <SearchableDropdownWithRef
              focus={focus}
              value={
                selectedClaimType && {
                  value: selectedClaimType,
                  label: convertEnumToTitle(selectedClaimType),
                  searchTerms: selectedClaimType,
                }
              }
              placeholder="What type of claim is this?"
              isClearable={false}
              onChange={(selection) => handleSetClaimType(selection.value)}
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
