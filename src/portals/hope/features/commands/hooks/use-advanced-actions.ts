import { differenceInSeconds, parseISO } from 'date-fns'
import { CommandLineAction } from 'portals/hope/features/commands/use-command-line'
import { useOldMemberSearch } from 'portals/hope/features/members-search/hooks/use-old-member-search'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useHistory, useLocation } from 'react-router'
import {
  UsersQuery,
  useSharePathMutation,
  useUsersQuery,
} from 'types/generated/graphql'
import { ArrayElement } from '@hedvig-ui/utils/array-element'

const getFilteredUsers = (
  searchValue: string,
  users: UsersQuery['users'],
  myEmail: string,
) => {
  const name = searchValue.split('@')[searchValue.split('@').length - 1]

  return (
    users?.filter(
      (user) =>
        user.email !== myEmail &&
        user.fullName.toLowerCase().includes(name.toLowerCase()),
    ) ?? []
  )
}

const getOnlineUsers = (
  searchValue: string,
  users: UsersQuery['users'],
  myEmail: string,
) => {
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
  const location = useLocation()

  const {
    me: { email: myEmail },
  } = useMe()
  const { data } = useUsersQuery()
  const [sharePath] = useSharePathMutation()
  const [{ members }, memberSearch, { loading: membersLoading }] =
    useOldMemberSearch()

  const advancedActions: CommandLineAction[] = [
    {
      label: 'Share path',
      onResolve: () => onChange('/share @'),
    },
    {
      label: 'Go to User',
      onResolve: () => onChange('/goto @'),
    },
    {
      label: 'Search Members',
      onResolve: () => onChange('/search @'),
    },
  ]

  const setUsersAsOptions = (
    users: UsersQuery['users'],
    action: (value: ArrayElement<UsersQuery['users']>) => void,
    field: keyof ArrayElement<UsersQuery['users']>,
  ) => {
    setResult(
      users.map((user) => ({
        label: user[field],
        onResolve: () => {
          action(user)
        },
      })),
    )
  }

  const handleShare = (user: ArrayElement<UsersQuery['users']>) => {
    toast.promise(
      sharePath({ variables: { path: location.pathname, userId: user.id } }),
      {
        loading: 'Sharing page',
        success: `Page shared with ${user.fullName.split(' ')[0]}`,
        error: 'Could not share page',
      },
    )
  }

  const handleToUser = (user: ArrayElement<UsersQuery['users']>) => {
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
        getFilteredUsers(searchValue, data?.users ?? [], myEmail),
        (user) => {
          handleShare(user)
          onHide()
        },
        'fullName',
      )
    }
    if (searchValue.includes('/goto')) {
      setUsersAsOptions(
        getOnlineUsers(searchValue, data?.users ?? [], myEmail),
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
