import { differenceInSeconds, parseISO } from 'date-fns'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { VerboseNotification } from 'portals/hope/features/user/share/components/VerboseNotification'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export const VerboseNotificationListener: React.FC = () => {
  const { me } = useMe()
  const NOTIFICATION_DURATION_SECONDS = 5

  useEffect(() => {
    const now = new Date()

    const unreadVerboseNotifications = me.notifications.filter(
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
  }, [me.notifications, me])

  return null
}
