import {
  Capitalized,
  Dropdown,
  DropdownOption,
  Flex,
  Label,
  Spacing,
} from '@hedvig-ui'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  ClaimProperty,
  ClaimPropertyOption,
  ClaimPropertySelection,
  useGetClaimTypeTemplateQuery,
  useSetClaimPropertySelectionMutation,
} from 'types/generated/graphql'

export const ClaimPropertyForm: React.FC<{
  claimId: string
  claimType: string
  propertySelections: ClaimPropertySelection[]
}> = ({ claimType, claimId, propertySelections }) => {
  const [setClaimPropertySelection] = useSetClaimPropertySelectionMutation()
  const { data } = useGetClaimTypeTemplateQuery({ variables: { claimType } })
  const properties = data?.claimTypeTemplate?.properties ?? []

  const handlePropertySelect = (
    property: ClaimProperty,
    option: ClaimPropertyOption | null,
  ) => {
    if (
      option &&
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
        optionIds: option?.id ? [option.id] : [],
      },
      optimisticResponse: {
        setClaimPropertySelection: {
          id: claimId,
          __typename: 'Claim',
          propertySelections: [
            ...propertySelections.filter(
              (selection) => selection.property.id !== property.id,
            ),
            ...(option
              ? [
                  {
                    claimType,
                    property,
                    option,
                  },
                ]
              : []),
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
              <Dropdown placeholder="Not specified">
                {[
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
                ].map((opt) => (
                  <DropdownOption
                    key={opt.key}
                    onClick={async () => {
                      const property = {
                        id: propertyId,
                        name,
                      }

                      if (opt.value === 'not_specified') {
                        handlePropertySelect(property, null)
                      }

                      const option = options.find((o) => o.id === opt.value)

                      if (!option) {
                        return
                      }

                      handlePropertySelect(property, option)
                    }}
                    selected={
                      opt.value === selectedOption?.option.id ||
                      (selectedOption === undefined &&
                        opt.value === 'not_specified' &&
                        false)
                    }
                  >
                    <Capitalized>{opt.text}</Capitalized>
                  </DropdownOption>
                ))}
              </Dropdown>
            </Spacing>
          )
        })}
    </Flex>
  )
}
