import { differenceInSeconds, parseISO } from 'date-fns'
import { VerboseNotification } from 'portals/hope/features/user/share/components/VerboseNotification'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNotifications } from 'portals/hope/features/user/notifications/hooks/use-notifications'

export const VerboseNotificationListener: React.FC = () => {
  const { notifications } = useNotifications()
  const NOTIFICATION_DURATION_SECONDS = 5

  useEffect(() => {
    const now = new Date()

    const unreadVerboseNotifications = notifications.filter(
      (notification) =>
        notification.verbose &&
        !notification.read &&
        differenceInSeconds(now, parseISO(notification.createdAt)) <
          NOTIFICATION_DURATION_SECONDS,
    )

    unreadVerboseNotifications.forEach((notification) => {
      toast.custom(
        () => (
          <VerboseNotification
            notificationId={notification.id}
            signature={notification?.from?.signature ?? ''}
            message={notification.message}
            toastId={notification.id}
            path={notification.url}
          />
        ),
        {
          id: notification.id,
          duration: NOTIFICATION_DURATION_SECONDS * 1000,
        },
      )
    })
  }, [notifications])

  return null
}
