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
  ClaimPropertyOption,
  GetClaimTypeRelationsDocument,
  GetClaimTypeRelationsQuery,
  useCreateClaimTypeRelationMutation,
  useGetClaimPropertiesQuery,
  useGetClaimPropertyOptionsQuery,
  useGetClaimTypeRelationsQuery,
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
  const { data } = useGetClaimPropertiesQuery()
  const claimProperties = data?.claimProperties

  if (!claimProperties) {
    return null
  }

  const properties = claimProperties.map((property) => ({
    value: property.id,
    label: property.name,
  }))

  return (
    <div style={{ width: '100%' }}>
      <SearchableDropdown
        value={
          value ? properties.find((option) => option.value === value) : null
        }
        placeholder="Select property"
        onChange={({ value: newValue }) => onChange(newValue)}
        noOptionsMessage={() => 'No properties found'}
        options={properties}
      />
    </div>
  )
}

const ClaimPropertyOptionDropdown: React.FC<{
  value: string
  onChange: (value: string) => void
  filter: (property: ClaimPropertyOption) => boolean
}> = ({ value, onChange, filter }) => {
  const { data } = useGetClaimPropertyOptionsQuery()
  const claimPropertyOptions = data?.claimPropertyOptions

  if (!claimPropertyOptions) {
    return null
  }

  const options = claimPropertyOptions.filter(filter).map((option) => ({
    value: option.id,
    label: option.name,
  }))

  return (
    <div style={{ width: '100%' }}>
      <SearchableDropdown
        value={value ? options.find((option) => option.value === value) : null}
        placeholder="Select option"
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
  const { data } = useGetClaimTypeRelationsQuery()

  const relations = data?.claimTypeRelations ?? []

  const reset = () => {
    setClaimType('')
    setClaimPropertyId('')
    setClaimPropertyOptionId('')
  }

  const handleSubmit = () => {
    toast.promise(
      createRelation({
        variables: {
          request: {
            claimType,
            propertyId: claimPropertyId,
            propertyOptionId: claimPropertyOptionId,
          },
        },
        update: (cache, { data: response }) => {
          if (!response) {
            return
          }
          const cachedData = cache.readQuery({
            query: GetClaimTypeRelationsDocument,
          })

          const cachedRelations = (cachedData as GetClaimTypeRelationsQuery)
            .claimTypeRelations

          cache.writeQuery({
            query: GetClaimTypeRelationsDocument,
            data: {
              claimTypeRelations: [
                ...cachedRelations,
                response.createClaimTypeRelation,
              ],
            },
          })
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
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
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
          filter={(option) =>
            !relations.find((relation) => {
              return (
                option.id === relation.propertyOption.id &&
                relation.property.id === claimPropertyId
              )
            })
          }
          value={claimPropertyOptionId}
          onChange={(value) => setClaimPropertyOptionId(value)}
        />
        <Spacing top={'small'} />
        <Button
          variation="primary"
          disabled={!claimType || !claimPropertyId || !claimPropertyOptionId}
          loading={loading}
          type="submit"
        >
          Create
        </Button>
      </Flex>
    </form>
  )
}
