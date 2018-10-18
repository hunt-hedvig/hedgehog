import * as PropTypes from 'prop-types'
import * as React from 'react'
import Notification from './Notification'

const Notifications = ({ notifications, dismissNotification }) => (
  <React.Fragment>
    {notifications.map((item, id) => (
      <React.Fragment key={item.id || id}>
        <Notification
          closeHandler={dismissNotification}
          content={{ ...item }}
        />
      </React.Fragment>
    ))}
  </React.Fragment>
)

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  dismissNotification: PropTypes.func.isRequired,
}

export default Notifications
