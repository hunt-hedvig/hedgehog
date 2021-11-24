import { differenceInSeconds, parseISO } from 'date-fns'
import { useMe } from 'features/user/hooks/use-me'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useHistory } from 'react-router'
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

const getUniqueUsers = (searchValue, users, myEmail) => {
  const name = searchValue.split('@')[searchValue.split('@').length - 1]

  return (
    users?.filter(
      (user) =>
        user.email !== myEmail &&
        user.fullName.toLowerCase().includes(name.toLowerCase()),
    ) ?? []
  )
}

const getOnlineUsers = (searchValue, users, myEmail) => {
  const name = searchValue.split('@')[searchValue.split('@').length - 1]
  const now = new Date()

  const uniqueUsers =
    users?.filter(
      (user) =>
        user.email !== myEmail &&
        user.fullName.toLowerCase().includes(name.toLowerCase()),
    ) ?? []

  return uniqueUsers
    .filter((user) =>
      user.latestPresence
        ? differenceInSeconds(now, parseISO(user.latestPresence)) <= 10
        : false,
    )
    .sort((u1, u2) =>
      u1.fullName.toLowerCase() > u2.fullName.toLowerCase() ? 1 : -1,
    )
}

export const useAdvancedActions = (
  searchValue: string,
  setSearchValue: (value: string) => void,
  hide: () => void,
) => {
  const [advanced, setAdvanced] = useState(false)
  const [options, setOptions] = useState<any>([])

  const {
    me: { email: myEmail },
  } = useMe()
  const { data } = useUsersQuery()
  const [sharePath] = useSharePathMutation()
  const history = useHistory()

  const advancedActions: CommandLineAction[] = [
    {
      label: 'Share path',
      onResolve: () => setSearchValue('/share @'),
    },
    {
      label: 'Go to User',
      onResolve: () => setSearchValue('/goto @'),
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

  const handleRedirect = (user: Omit<User, 'notifications' | 'signature'>) => {
    const hasCurrentLocation = !!user.latestLocation && user.email !== myEmail

    if (hasCurrentLocation && user.latestLocation) {
      history.push(user?.latestLocation)
    }
  }

  useEffect(() => {
    if (searchValue.includes('@')) {
      if (searchValue.includes('/share')) {
        setValuesAsOptions(
          getUniqueUsers(searchValue, data?.users, myEmail),
          'fullName',
          (user) => {
            handleShare(user, sharePath)
            hide()
          },
        )
      }
      if (searchValue.includes('/goto')) {
        // some action
        setValuesAsOptions(
          getOnlineUsers(searchValue, data?.users, myEmail),
          'fullName',
          (user) => {
            handleRedirect(user)
            hide()
          },
        )
      }
    } else if (searchValue[0] === '/') {
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
