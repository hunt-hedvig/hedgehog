import { useMe } from 'features/user/hooks/use-me'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  User,
  useSharePathMutation,
  useUsersQuery,
} from 'types/generated/graphql'
import { CommandLineAction } from './command-line-hook'

const handleShare = (
  user: Omit<User, 'notifications' | 'signature'>,
  sharePath,
) => {
  toast.promise(
    sharePath({ variables: { path: location.pathname, userId: user.id } }),
    {
      loading: 'Sharing page',
      success: `Page shared with ${user.fullName.split(' ')[0]}`,
      error: 'Could not share page',
    },
  )
}

const getUniqueUsers = (searchValue, data, myEmail) => {
  const name = searchValue.split('@')[searchValue.split('@').length - 1]
  const users =
    data?.users?.filter(
      (user) =>
        user.email !== myEmail &&
        user.fullName.toLowerCase().includes(name.toLowerCase()),
    ) ?? []

  return users
}

export const useAdvancedActions = (searchValue, setSearchValue, hide) => {
  const [advanced, setAdvanced] = useState(false)
  const [options, setOptions] = useState<any>([])

  const {
    me: { email: myEmail },
  } = useMe()
  const { data } = useUsersQuery()
  const [sharePath] = useSharePathMutation()

  const advancedActions: CommandLineAction[] = [
    {
      label: 'Share path',
      onResolve: () => setSearchValue('/share @'),
    },
  ]

  const setValuesAsOptions = (values, field, action) => {
    setOptions(
      values.map((value) => ({
        label: value[field],
        onResolve: () => {
          action(value)
        },
      })),
    )
  }

  useEffect(() => {
    if (searchValue.includes('/share') && searchValue.includes('@')) {
      setValuesAsOptions(
        getUniqueUsers(searchValue, data, myEmail),
        'fullName',
        (user) => {
          handleShare(user, sharePath)
          hide()
        },
      )
    } else if (searchValue[0] === '/' && !searchValue.includes('@')) {
      setAdvanced(true)
      setOptions(advancedActions)
    } else {
      setOptions([])
      setAdvanced(false)
    }
  }, [searchValue])

  return {
    advanced,
    options,
  }
}
