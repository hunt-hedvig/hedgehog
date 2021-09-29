import { Button, Flex, Input, Label, Spacing } from '@hedvig-ui'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetClaimPropertyOptionsDocument,
  GetClaimPropertyOptionsQuery,
  useCreateClaimPropertyOptionMutation,
  useGetClaimPropertyOptionsQuery,
} from 'types/generated/graphql'

export const CreateOptionForm: React.FC<{}> = () => {
  const { data } = useGetClaimPropertyOptionsQuery()
  const [newOptionName, setNewOptionName] = useState('')
  const [createOption, { loading }] = useCreateClaimPropertyOptionMutation()

  const options = data?.claimPropertyOptions

  if (!options) {
    return null
  }

  const handleSubmit = () => {
    toast.promise(
      createOption({
        variables: { name: newOptionName },
        update: (cache, { data: response }) => {
          const newClaimPropertyOption = response?.createClaimPropertyOption

          if (!newClaimPropertyOption) {
            return
          }

          const cachedData = cache.readQuery({
            query: GetClaimPropertyOptionsDocument,
          })

          const cachedClaimPropertyOptions = (cachedData as GetClaimPropertyOptionsQuery)
            .claimPropertyOptions

          cache.writeQuery({
            query: GetClaimPropertyOptionsDocument,
            data: {
              claimPropertyOptions: [
                ...cachedClaimPropertyOptions,
                newClaimPropertyOption,
              ],
            },
          })
        },
      }),
      {
        loading: 'Creating option',
        success: () => {
          setNewOptionName('')
          return 'Option created'
        },
        error: 'Could not create option',
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
        <Label>Option name</Label>
        <Input
          value={newOptionName}
          onChange={(e) => {
            setNewOptionName(e.currentTarget.value)
          }}
          style={{ width: '100%' }}
        />
        <Spacing top={'small'} />
        <Button
          disabled={
            !!options.find(
              (option) =>
                option.name.toLowerCase() === newOptionName.toLowerCase(),
            ) ||
            !newOptionName ||
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
