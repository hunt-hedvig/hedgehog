import * as types from 'lib/messageTypes'
import PropTypes from 'prop-types'
import React from 'react'
import { Checkbox, List } from 'semantic-ui-react'

const SelectList = ({ content }) => {
  const list = content.choices.map((item, id) => {
    if (item.type === 'link') {
      const link = item.appUrl || item.webUrl || item.view
      return (
        <List.Item key={id}>
          <List.Content>
            {content.type === types.MULTIPLE_SELECT ? (
              <Checkbox
                readOnly
                checked={item.selected}
                label={
                  <label>
                    <a href={link}>{item.text}</a>
                  </label>
                }
              />
            ) : (
              <Checkbox
                radio
                readOnly
                checked={item.selected}
                label={
                  <label>
                    <a href={link}>{item.text}</a>
                  </label>
                }
              />
            )}
          </List.Content>
        </List.Item>
      )
    } else {
      return (
        <List.Item key={id} selected={item.selected}>
          <List.Content>
            {content.type === types.MULTIPLE_SELECT ? (
              <Checkbox readOnly checked={item.selected} label={item.text} />
            ) : (
              <Checkbox
                radio
                readOnly
                checked={item.selected}
                label={item.text}
              />
            )}
          </List.Content>
        </List.Item>
      )
    }
  })

  return <List>{list}</List>
}

export default SelectList

SelectList.propTypes = {
  content: PropTypes.object.isRequired,
}
