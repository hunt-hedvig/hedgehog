import { differenceInSeconds, parseISO } from 'date-fns'
import { useMemberSearch } from 'features/members-search/hooks/use-member-search'
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
  const history = useHistory()

  const [advanced, setAdvanced] = useState(false)
  const [options, setOptions] = useState<
    Array<{ label: string; onResolve: () => void }>
  >([])

  const {
    me: { email: myEmail },
  } = useMe()
  const { data } = useUsersQuery()
  const [sharePath] = useSharePathMutation()
  const [
    { members },
    memberSearch,
    { loading: membersLoading },
  ] = useMemberSearch()

  const advancedActions: CommandLineAction[] = [
    {
      label: 'Share path',
      onResolve: () => {
        setSearchValue('/share @')
        setOptions([])
      },
    },
    {
      label: 'Go to User',
      onResolve: () => {
        setSearchValue('/goto @')
        setOptions([])
      },
    },
    {
      label: 'Search Members',
      onResolve: () => {
        setSearchValue('/search @')
        setOptions([])
      },
    },
  ]

  const setValuesAsOptions = (values, action, field) => {
    setOptions(
      values.map((value) => ({
        label: value[field],
        onResolve: () => {
          action(value)
        },
      })),
    )
  }

  const handleToUser = (user: Omit<User, 'notifications' | 'signature'>) => {
    const hasCurrentLocation = !!user.latestLocation && user.email !== myEmail

    if (hasCurrentLocation && user.latestLocation) {
      history.push(user?.latestLocation)
    }
  }

  const handleToMember = (id: string) => {
    const link = `/members/${id}/contracts`

    history.push(link)
  }

  const searchMembers = () => {
    const name = searchValue.split('@')[searchValue.split('@').length - 1]
    memberSearch(name || '%', { page: 0 })
  }

  useEffect(() => {
    if (searchValue.includes('@')) {
      if (searchValue.includes('/share')) {
        setValuesAsOptions(
          getUniqueUsers(searchValue, data?.users, myEmail),
          (user) => {
            handleShare(user, sharePath)
            hide()
          },
          'fullName',
        )
      }
      if (searchValue.includes('/goto')) {
        setValuesAsOptions(
          getOnlineUsers(searchValue, data?.users, myEmail),
          (user) => {
            handleToUser(user)
            hide()
          },
          'fullName',
        )
      }
      if (searchValue.includes('/search')) {
        searchMembers()
      }
    } else if (searchValue === '/') {
      setAdvanced(true)
      setOptions(advancedActions)
    } else {
      setOptions([])
    }

    if (!searchValue.includes('/')) {
      setAdvanced(false)
    }
  }, [searchValue])

  useEffect(() => {
    if (!membersLoading && members.length) {
      setOptions(
        members.map((member) => ({
          label: `${member.firstName} ${member.lastName}`,
          onResolve: () => {
            handleToMember(member.memberId)
            hide()
          },
        })),
      )
    } else if (membersLoading) {
      setOptions([
        {
          label: 'Loading...',
          onResolve: () => {
            return
          },
        },
      ])
    }
  }, [members.length, membersLoading])

  return {
    advanced,
    options,
  }
}
