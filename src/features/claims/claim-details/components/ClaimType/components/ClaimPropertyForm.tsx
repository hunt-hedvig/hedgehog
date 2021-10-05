import { Dropdown, Flex, Label, Placeholder, Spacing } from '@hedvig-ui'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  ClaimProperty,
  ClaimPropertyOption,
  ClaimPropertySelection,
  useGetClaimTypeTemplateQuery,
  useSetClaimPropertySelectionMutation,
  useUnsetClaimPropertySelectionMutation,
} from 'types/generated/graphql'

export const ClaimPropertyForm: React.FC<{
  claimId: string
  claimType: string
  propertySelections: ClaimPropertySelection[]
}> = ({ claimType, claimId, propertySelections }) => {
  const [setClaimPropertySelection] = useSetClaimPropertySelectionMutation()
  const [unsetClaimPropertySelection] = useUnsetClaimPropertySelectionMutation()
  const { data } = useGetClaimTypeTemplateQuery({ variables: { claimType } })
  const properties = data?.claimTypeTemplate?.properties ?? []

  const handlePropertyReset = (propertyId: string) => {
    unsetClaimPropertySelection({
      variables: {
        id: claimId,
        claimType,
        propertyId,
      },
      optimisticResponse: {
        unsetClaimPropertySelection: {
          id: claimId,
          __typename: 'Claim',
          propertySelections: [
            ...propertySelections.filter(
              (selection) => selection.property.id !== propertyId,
            ),
          ],
        },
      },
    })
  }

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
      variables: {
        id: claimId,
        claimType,
        propertyId: property.id,
        optionId: option.id,
      },
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
              claimType,
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
      {properties
        .slice(0)
        .reverse()
        .map(({ propertyId, name, options }) => {
          const selectedOption = propertySelections.find(
            (selection) => selection.property.id === propertyId,
          )

          return (
            <Spacing key={propertyId} top="small">
              <Label>{name}</Label>
              <Dropdown
                value={selectedOption?.option.id ?? 'not_specified'}
                onRender={() =>
                  !selectedOption?.option.id ? (
                    <Placeholder>Not specified</Placeholder>
                  ) : (
                    <>{selectedOption?.option.name}</>
                  )
                }
                onChange={(optionId) => {
                  if (optionId === 'not_specified') {
                    handlePropertyReset(propertyId)
                  }

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
                options={[
                  ...options.map((option) => ({
                    key: option.id,
                    value: option.id,
                    text: option.name,
                  })),
                  {
                    key: 'not_specified',
                    value: 'not_specified',
                    text: 'Not specified',
                  },
                ]}
              />
            </Spacing>
          )
        })}
    </Flex>
  )
}
