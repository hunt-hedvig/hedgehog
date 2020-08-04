import { IRemindNotification } from 'components/tickets/types'
import React from 'react'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup'

export const OverdueNotifier = (props: { reminder: IRemindNotification }) => {
  return (
    <Popup
      hoverable
      trigger={<Icon name="exclamation triangle" size="large" color="red" />}
    >
      <h4>Sent reminder</h4>
      <p>
        <strong>Message:</strong> {props.reminder.message}
      </p>
      <p>
        <strong>Sent at:</strong>{' '}
        {props.reminder.time + ' ' + props.reminder.date}
      </p>
    </Popup>
  )
}
