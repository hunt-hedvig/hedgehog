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
import {
  useCreateClaimPropertyMutation,
  useCreateClaimPropertyOptionMutation,
  useGetClaimPropertiesQuery,
  useGetClaimPropertyOptionQuery,
  useGetClaimPropertyOptionsQuery,
  useGetClaimTypesQuery,
} from 'types/generated/graphql'

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
  const [createClaimProperty, { loading }] = useCreateClaimPropertyMutation()
  const { data } = useGetClaimPropertiesQuery()
  const claimProperties = data?.claimProperties

  if (!claimProperties) {
    return null
  }

  return (
    <div style={{ width: '100%' }}>
      <SearchableDropdown
        creatable={true}
        formatCreateLabel={(optionValue) => (
          <span>
            Create property "<b>{optionValue}</b>"?
          </span>
        )}
        onCreateOption={(option) => {
          if (!option) {
            return
          }
        }}
        value={
          value
            ? {
                value,
                label: value,
              }
            : null
        }
        placeholder="Select property"
        isLoading={loading}
        isCreatable={true}
        onChange={onChange}
        noOptionsMessage={() => 'No properties found'}
        options={claimProperties.map((property) => ({
          value: property.id,
          label: property.name,
        }))}
      />
    </div>
  )
}

const ClaimPropertyOptionDropdown: React.FC<{
  value: string
  onChange: (value: string) => void
}> = ({ value, onChange }) => {
  const [
    createClaimPropertyOption,
    { loading },
  ] = useCreateClaimPropertyOptionMutation()
  const { data } = useGetClaimPropertyOptionsQuery()
  const claimPropertyOptions = data?.claimPropertyOptions

  if (!claimPropertyOptions) {
    return null
  }

  return (
    <div style={{ width: '100%' }}>
      <SearchableDropdown
        creatable={true}
        formatCreateLabel={(optionValue) => (
          <span>
            Create option "<b>{optionValue}</b>"?
          </span>
        )}
        onCreateOption={(option) => {
          if (!option) {
            return
          }
        }}
        value={
          value
            ? {
                value,
                label: value,
              }
            : null
        }
        placeholder="Select option"
        isLoading={loading}
        isCreatable={true}
        onChange={onChange}
        noOptionsMessage={() => 'No options found'}
        options={claimPropertyOptions.map((option) => ({
          value: option.id,
          label: option.name,
        }))}
      />
    </div>
  )
}

export const CreateRelationForm: React.FC<{}> = () => {
  const [claimType, setClaimType] = useState('')
  const [claimPropertyId, setClaimPropertyId] = useState('')
  const [claimPropertyOptionId, setClaimPropertyOptionId] = useState('')

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
      <Button variation="primary">Create</Button>
    </Flex>
  )
}
