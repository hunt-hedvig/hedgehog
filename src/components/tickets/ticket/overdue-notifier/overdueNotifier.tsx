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
        <b>Message:</b> {props.reminder.message}
      </p>
      <p>
        <b>Sent at:</b> {props.reminder.time + ' ' + props.reminder.date}
      </p>
    </Popup>
  )
}
