import {
  CardContent,
  CardTitle,
  Dropdown,
  Flex,
  Label,
  SearchableDropdownWithRef,
  Spacing,
} from '@hedvig-ui'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  ClaimProperty,
  ClaimPropertyOption,
  ClaimPropertySelection,
  useClaimPageQuery,
  useGetClaimTypesQuery,
  useGetClaimTypeTemplateQuery,
  useSetClaimPropertySelectionMutation,
  useSetClaimTypeMutation,
} from 'types/generated/graphql'
import { convertEnumToTitle } from 'utils/text'

const ClaimPropertyForm: React.FC<{
  claimId: string
  claimType: string
  propertySelections: ClaimPropertySelection[]
}> = ({ claimType, claimId, propertySelections }) => {
  const [setClaimPropertySelection] = useSetClaimPropertySelectionMutation()
  const { data } = useGetClaimTypeTemplateQuery({ variables: { claimType } })
  const properties = data?.claimTypeTemplate?.properties ?? []

  const handlePropertySelect = (
    property: ClaimProperty,
    option: ClaimPropertyOption,
  ) => {
    if (
      propertySelections.find(
        (selection) =>
          selection.property.id === property.id &&
          selection.option.id === option.id,
      )
    ) {
      return
    }

    setClaimPropertySelection({
      variables: { id: claimId, propertyId: property.id, optionId: option.id },
      optimisticResponse: {
        setClaimPropertySelection: {
          id: claimId,
          __typename: 'Claim',
          propertySelections: [
            ...propertySelections.filter(
              (selection) => selection.property.id !== property.id,
            ),
            {
              __typename: 'ClaimPropertySelection',
              property,
              option,
            },
          ],
        },
      },
    }).catch(() => toast.error('Could not set property'))
  }

  return (
    <Flex direction="column">
      {properties.map(({ propertyId, name, options }) => {
        const selectedOption = propertySelections.find(
          (selection) => selection.property.id === propertyId,
        )

        return (
          <Spacing top="small">
            <Label key={propertyId}>{name}</Label>
            <Dropdown
              value={selectedOption?.option.id ?? ''}
              onChange={(optionId) => {
                const option = options.find((o) => o.id === optionId)

                if (!option) {
                  return
                }

                handlePropertySelect(
                  {
                    id: propertyId,
                    name,
                  },
                  option,
                )
              }}
              options={options.map((option) => ({
                key: option.id,
                value: option.id,
                text: option.name,
              }))}
            />
          </Spacing>
        )
      })}
    </Flex>
  )
}

export const ClaimType: React.FC<{
  claimId: string
}> = ({ claimId }) => {
  const { data: claimInformationData } = useClaimPageQuery({
    variables: { claimId },
  })

  const { data, error } = useGetClaimTypesQuery()
  const [setClaimType] = useSetClaimTypeMutation()
  const claimTypes = data?.claimTypes ?? []
  const selectedClaimType = claimInformationData?.claim?.claimType

  const handleSetClaimType = (claimType: string) => {
    setClaimType({
      variables: { id: claimId, type: claimType },
      optimisticResponse: {
        setClaimType: {
          ...claimInformationData,
          __typename: 'Claim',
          id: claimId,
          claimType,
          events: claimInformationData?.claim?.events ?? [],
        },
      },
    }).catch(() => toast.error('Could not set type'))
  }

  return (
    <Flex direction="column">
      <CardContent>
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
              claimInformationData?.claim?.propertySelections ?? []
            }
          />
        )}
      </CardContent>
    </Flex>
  )
}
