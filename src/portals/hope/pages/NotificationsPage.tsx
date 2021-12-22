import { Flex, Input, MainHeadline, Spacing } from '@hedvig-ui'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { NotificationItem } from 'portals/hope/features/user/notifications/components/NotificationItem'
import React, { useMemo, useState } from 'react'
import { Page } from 'portals/hope/pages/routes'

const NotificationsPage: Page = () => {
  const [filter, setFilter] = useState('')
  const { me } = useMe()

  const notifications = useMemo(
    () =>
      me.notifications.filter(({ message }) =>
        message.toLowerCase().includes(filter.toLowerCase()),
      ),
    [me.notifications, filter],
  )

  return (
    <>
      <MainHeadline>Notifications</MainHeadline>
      <Flex
        direction="column"
        justify="flex-start"
        style={{ maxWidth: '800px' }}
      >
        <Input
          muted
          size="large"
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
          placeholder="Your filter goes here..."
        />
        <Spacing top="small" />
        {notifications.map((notification) => (
          <div key={notification.id} style={{ width: '100%' }}>
            <NotificationItem notification={notification} />
          </div>
        ))}
      </Flex>
    </>
  )
}

export default NotificationsPage
