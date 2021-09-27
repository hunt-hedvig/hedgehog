import {
  Button,
  Flex,
  Input,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  ClaimPropertyOption,
  GetClaimPropertyOptionsDocument,
  GetClaimPropertyOptionsQuery,
  useDeprecateClaimPropertyOptionMutation,
  useGetClaimPropertyOptionsQuery,
  useUpdateClaimPropertyOptionMutation,
} from 'types/generated/graphql'
import { Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'
import { convertCamelcaseToTitle } from 'utils/text'

const UpdateNameInput: React.FC<{
  initial: string
  onSubmit: (value: string) => void
  disabled: boolean
}> = ({ initial, onSubmit, disabled }) => {
  const [value, setValue] = useState(initial)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(value)
      }}
      style={{ width: '100%' }}
    >
      <Flex align="center">
        <Input
          autoFocus
          size="small"
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        <Button type="submit" variation="primary" style={{ marginLeft: '1em' }}>
          Update
        </Button>
      </Flex>
    </form>
  )
}

export const OptionsTable: React.FC<{ filter: string }> = ({ filter }) => {
  const [
    updateOption,
    { loading: updateLoading },
  ] = useUpdateClaimPropertyOptionMutation()
  const [
    deprecateOption,
    { loading: deprecateLoading },
  ] = useDeprecateClaimPropertyOptionMutation()
  const [editing, setEditing] = useState<null | string>(null)
  const { data } = useGetClaimPropertyOptionsQuery()
  const claimPropertyOptions = data?.claimPropertyOptions

  if (!claimPropertyOptions) {
    return null
  }

  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  useEffect(() => {
    if (isEscapePressed) {
      setEditing(null)
    }
  }, [isEscapePressed])

  const handleUpdateOption = (value: string, option: ClaimPropertyOption) => {
    toast.promise(
      updateOption({
        variables: { id: option.id, name: value },
        optimisticResponse: {
          updateClaimPropertyOption: {
            id: option.id,
            __typename: 'ClaimPropertyOption',
            name: value,
          },
        },
      }),
      {
        loading: 'Updating option',
        success: () => {
          setEditing(null)
          return 'Option updated'
        },
        error: 'Could not update option',
      },
    )
  }

  const handleDeprecateOption = (option: ClaimPropertyOption) => {
    toast.promise(
      deprecateOption({
        variables: { id: option.id },
        update: (cache, { data: response }) => {
          if (!response) {
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
              claimPropertyOptions: cachedClaimPropertyOptions.filter(
                (claimPropertyOption) => claimPropertyOption.id !== option.id,
              ),
            },
          })
        },
      }),
      {
        loading: 'Deprecating option',
        success: () => {
          setEditing(null)
          return 'Option deprecated'
        },
        error: 'Could not deprecate option',
      },
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Name</TableHeaderColumn>
      </TableHeader>

      {claimPropertyOptions
        .filter((type) =>
          filter
            ? type.name.toLowerCase().includes(filter.toLowerCase())
            : true,
        )
        .map((option) => (
          <TableRow
            key={option.id}
            onClick={() => option.id !== editing && setEditing(option.id)}
          >
            <TableColumn>
              {editing === option.id ? (
                <Flex align="center">
                  <UpdateNameInput
                    initial={option.name}
                    disabled={updateLoading || deprecateLoading}
                    onSubmit={(value) => handleUpdateOption(value, option)}
                  />
                  <Button
                    onClick={() => handleDeprecateOption(option)}
                    variation="danger"
                    style={{ marginLeft: '1em' }}
                    disabled={deprecateLoading}
                  >
                    Deprecate
                  </Button>
                  <Button
                    onClick={() => setEditing(null)}
                    variation="ghost"
                    style={{ marginLeft: '1em' }}
                  >
                    Cancel
                  </Button>
                </Flex>
              ) : (
                convertCamelcaseToTitle(option.name)
              )}
            </TableColumn>
          </TableRow>
        ))}
    </Table>
  )
}
