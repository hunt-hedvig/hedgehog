import { Button, Flex, Input, Label, Spacing } from '@hedvig-ui'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetClaimPropertiesDocument,
  GetClaimPropertiesQuery,
  useCreateClaimPropertyMutation,
  useGetClaimPropertiesQuery,
} from 'types/generated/graphql'

export const CreatePropertyForm: React.FC<{}> = () => {
  const { data } = useGetClaimPropertiesQuery()
  const [newPropertyName, setNewPropertyName] = useState('')
  const [createProperty, { loading }] = useCreateClaimPropertyMutation()

  const properties = data?.claimProperties

  if (!properties) {
    return null
  }

  const handleSubmit = () => {
    toast.promise(
      createProperty({
        variables: { name: newPropertyName },
        update: (cache, { data: response }) => {
          const newClaimProperty = response?.createClaimProperty

          if (!newClaimProperty) {
            return
          }

          const cachedData = cache.readQuery({
            query: GetClaimPropertiesDocument,
          })

          const cachedClaimProperties = (cachedData as GetClaimPropertiesQuery)
            .claimProperties

          cache.writeQuery({
            query: GetClaimPropertiesDocument,
            data: {
              claimProperties: [...cachedClaimProperties, newClaimProperty],
            },
          })
        },
      }),
      {
        loading: 'Creating property',
        success: () => {
          setNewPropertyName('')
          return 'Property created'
        },
        error: 'Could not create property',
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
        <Label>Property name</Label>
        <Input
          value={newPropertyName}
          onChange={(e) => {
            setNewPropertyName(e.currentTarget.value)
          }}
        />
        <Spacing top={'small'} />
        <Button
          disabled={
            !!properties.find(
              (property) =>
                property.name.toLowerCase() === newPropertyName.toLowerCase(),
            ) ||
            !newPropertyName ||
            loading
          }
          type="submit"
        >
          Create
        </Button>
      </Flex>
    </form>
  )
}
