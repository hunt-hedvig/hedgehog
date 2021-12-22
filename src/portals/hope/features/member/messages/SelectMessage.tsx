import styled from '@emotion/styled'
import { Checkbox, RadioGroup } from '@hedvig-ui'
import * as types from 'portals/hope/features/member/messages/message-types'
import PropTypes from 'prop-types'
import React from 'react'

const List = styled.div`
  margin-top: 0.5em;
`

const SelectList = ({ content }) => (
  <List>
    {content.type === types.MULTIPLE_SELECT ? (
      content.choices.map((item, id) =>
        item.type === 'link' ? (
          <Checkbox
            key={id}
            readOnly
            checked={item.selected}
            label={
              <label>
                <a href={item.appUrl || item.webUrl || item.view}>
                  {item.text}
                </a>
              </label>
            }
          />
        ) : (
          <Checkbox
            key={id}
            readOnly
            checked={item.selected}
            label={item.text}
          />
        ),
      )
    ) : (
      <RadioGroup
        value={content.choices.filter((item) => item.selected)[0]?.text}
        options={content.choices.map((item) => ({
          value: item.text,
          label:
            item.type === 'link' ? (
              <a href={item.appUrl || item.webUrl || item.view}>{item.text}</a>
            ) : (
              item.text
            ),
          disabled: false,
        }))}
      />
    )}
  </List>
)

export default SelectList

SelectList.propTypes = {
  content: PropTypes.object.isRequired,
}
