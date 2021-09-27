import {
  Button,
  Dropdown,
  Flex,
  getTextFromEnumValue,
  Label,
  SearchableDropdown,
  Spacing,
} from '@hedvig-ui'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  useCreateClaimPropertyMutation,
  useCreateClaimPropertyOptionMutation,
  useCreateClaimTypeRelationMutation,
  useGetClaimPropertiesQuery,
  useGetClaimPropertyOptionsQuery,
  useGetClaimTypesQuery,
} from 'types/generated/graphql'
import { useConfirmDialog } from 'utils/hooks/modal-hook'

const ClaimTypeDropdown: React.FC<{
  value: string
  onChange: (value: string) => void
}> = ({ value, onChange }) => {
  const { data } = useGetClaimTypesQuery()
  const claimTypes = data?.claimTypes

  if (!claimTypes) {
    return null
  }

  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={claimTypes.map((type) => ({
        value: type,
        text: getTextFromEnumValue(type),
      }))}
    />
  )
}

const ClaimPropertyDropdown: React.FC<{
  value: string
  onChange: (value: string) => void
}> = ({ value, onChange }) => {
  const { confirm } = useConfirmDialog()
  const [createClaimProperty, { loading }] = useCreateClaimPropertyMutation()
  const { data } = useGetClaimPropertiesQuery()
  const claimProperties = data?.claimProperties

  if (!claimProperties) {
    return null
  }

  const options = claimProperties.map((property) => ({
    value: property.id,
    label: property.name,
  }))

  return (
    <div style={{ width: '100%' }}>
      <SearchableDropdown
        creatable={true}
        formatCreateLabel={(proposedValue) => (
          <span>
            Create property "<b>{proposedValue}</b>"?
          </span>
        )}
        onCreateOption={(property) => {
          if (!property) {
            return
          }

          confirm(
            `Are you sure you want to create the property ${property}`,
          ).then(() => {
            toast.promise(
              createClaimProperty({ variables: { name: property } }),
              {
                loading: 'Creating property',
                success: 'Property created',
                error: 'Could not create property',
              },
            )
          })
        }}
        value={value ? options.find((option) => option.value === value) : null}
        placeholder="Select property"
        isLoading={loading}
        isCreatable={true}
        onChange={({ value: newValue }) => onChange(newValue)}
        noOptionsMessage={() => 'No properties found'}
        options={options}
      />
    </div>
  )
}

const ClaimPropertyOptionDropdown: React.FC<{
  value: string
  onChange: (value: string) => void
}> = ({ value, onChange }) => {
  const { confirm } = useConfirmDialog()
  const [
    createClaimPropertyOption,
    { loading },
  ] = useCreateClaimPropertyOptionMutation()
  const { data } = useGetClaimPropertyOptionsQuery()
  const claimPropertyOptions = data?.claimPropertyOptions

  if (!claimPropertyOptions) {
    return null
  }

  const options = claimPropertyOptions.map((option) => ({
    value: option.id,
    label: option.name,
  }))

  return (
    <div style={{ width: '100%' }}>
      <SearchableDropdown
        creatable={true}
        formatCreateLabel={(proposedValue) => (
          <span>
            Create property "<b>{proposedValue}</b>"?
          </span>
        )}
        onCreateOption={(option) => {
          if (!option) {
            return
          }

          confirm(
            `Are you sure you want to create the property ${option}`,
          ).then(() => {
            toast.promise(
              createClaimPropertyOption({ variables: { name: option } }),
              {
                loading: 'Creating option',
                success: 'Option created',
                error: 'Could not create option',
              },
            )
          })
        }}
        value={value ? options.find((option) => option.value === value) : null}
        placeholder="Select option"
        isLoading={loading}
        isCreatable={true}
        onChange={({ value: newValue }) => onChange(newValue)}
        noOptionsMessage={() => 'No options found'}
        options={options}
      />
    </div>
  )
}

export const CreateRelationForm: React.FC<{}> = () => {
  const [claimType, setClaimType] = useState('')
  const [claimPropertyId, setClaimPropertyId] = useState('')
  const [claimPropertyOptionId, setClaimPropertyOptionId] = useState('')

  const [createRelation, { loading }] = useCreateClaimTypeRelationMutation()

  const reset = () => {
    setClaimType('')
    setClaimPropertyId('')
    setClaimPropertyOptionId('')
  }

  return (
    <Flex direction="column" fullWidth>
      <Label>Claim Type</Label>
      <ClaimTypeDropdown
        value={claimType}
        onChange={(value) => setClaimType(value)}
      />
      <Spacing top={'small'} />
      <Label>Property</Label>
      <ClaimPropertyDropdown
        value={claimPropertyId}
        onChange={(value) => setClaimPropertyId(value)}
      />
      <Spacing top={'small'} />
      <Label>Option</Label>
      <ClaimPropertyOptionDropdown
        value={claimPropertyOptionId}
        onChange={(value) => setClaimPropertyOptionId(value)}
      />
      <Spacing top={'small'} />
      <Button
        variation="primary"
        loading={loading}
        onClick={() => {
          toast.promise(
            createRelation({
              variables: {
                request: {
                  claimType,
                  propertyId: claimPropertyId,
                  propertyOptionId: claimPropertyOptionId,
                },
              },
            }),
            {
              loading: 'Creating relation',
              success: () => {
                reset()
                return 'Relation created'
              },
              error: 'Could not create relation',
            },
          )
        }}
      >
        Create
      </Button>
    </Flex>
  )
}
