import { differenceInSeconds, parseISO } from 'date-fns'
import { useMemberSearch } from 'features/members-search/hooks/use-member-search'
import { useMe } from 'features/user/hooks/use-me'
import { useEffect } from 'react'
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

const getFilteredUsers = (searchValue, users, myEmail) => {
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
  const now = new Date()

  const filteredUsers = getFilteredUsers(searchValue, users, myEmail)

  return filteredUsers
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
  onChange: (value: string) => void,
  setResult: (value: CommandLineAction[]) => void,
  onHide: () => void,
) => {
  const history = useHistory()

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
        onChange('/share @')
        setResult([])
      },
    },
    {
      label: 'Go to User',
      onResolve: () => {
        onChange('/goto @')
        setResult([])
      },
    },
    {
      label: 'Search Members',
      onResolve: () => {
        onChange('/search @')
        setResult([])
      },
    },
  ]

  const setUsersAsOptions = (
    users: User[],
    action: (value: User) => void,
    field: string,
  ) => {
    setResult(
      users.map((value) => ({
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
    memberSearch(name || '%', { page: 0, pageSize: 10 })
  }

  useEffect(() => {
    if (!searchValue.includes('@') && searchValue[0] === '/') {
      setResult(
        advancedActions.filter((act) =>
          `/${act.label}`.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )

      return
    }

    if (searchValue.includes('/share')) {
      setUsersAsOptions(
        getFilteredUsers(searchValue, data?.users, myEmail),
        (user) => {
          handleShare(user, sharePath)
          onHide()
        },
        'fullName',
      )
    }
    if (searchValue.includes('/goto')) {
      setUsersAsOptions(
        getOnlineUsers(searchValue, data?.users, myEmail),
        (user) => {
          handleToUser(user)
          onHide()
        },
        'fullName',
      )
    }

    if (searchValue.includes('/search')) {
      searchMembers()
    }
  }, [searchValue])

  useEffect(() => {
    if ((!membersLoading && !members.length) || membersLoading) {
      setResult([
        {
          label: membersLoading ? 'Loading...' : 'Empty',
          onResolve: () => {
            return
          },
        },
      ])

      return
    }

    setResult(
      members.map((member) => ({
        label: `${member.firstName} ${member.lastName}`,
        onResolve: () => {
          handleToMember(member.memberId)
          onHide()
        },
      })),
    )
  }, [members.length, membersLoading])
}
