import gql from 'graphql-tag'
import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useUserNotificationsQuery,
} from 'types/generated/graphql'

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

export const useNotifications = () => {
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
