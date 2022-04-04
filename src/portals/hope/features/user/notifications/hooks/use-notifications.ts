import gql from 'graphql-tag'
import {
  MarkAllNotificationsAsReadMutation,
  MarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  UserNotificationsQuery,
  useUserNotificationsQuery,
} from 'types/generated/graphql'
import { FetchResult } from '@apollo/client'

gql`
  query UserNotifications {
    me {
      user {
        notifications {
          id
          message
          url
          createdAt
          read
          verbose
          from {
            id
            signature
            fullName
            signature
          }
        }
      }
    }
  }

  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
      id
      read
    }
  }

  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      id
      read
    }
  }
`

interface UseNotificationsResult {
  notifications: UserNotificationsQuery['me']['user']['notifications']
  read: (
    notificationId: string,
  ) => Promise<FetchResult<MarkNotificationAsReadMutation>>
  readAll: () => Promise<FetchResult<MarkAllNotificationsAsReadMutation>>
}

export const useNotifications = (): UseNotificationsResult => {
  const { data } = useUserNotificationsQuery()
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation()
  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation()

  const notifications = data?.me?.user?.notifications ?? []

  const readAllHandler = () =>
    markAllNotificationsAsRead({
      optimisticResponse: {
        markAllNotificationsAsRead: notifications.map((notification) => ({
          ...notification,
          __typename: 'UserNotification',
          read: true,
        })),
      },
    })

  const readHandler = (notificationId: string) =>
    markNotificationAsRead({
      variables: { notificationId },
      optimisticResponse: {
        markNotificationAsRead: {
          __typename: 'UserNotification',
          id: notificationId,
          read: true,
        },
      },
    })

  return {
    notifications,
    readAll: readAllHandler,
    read: readHandler,
  }
}
