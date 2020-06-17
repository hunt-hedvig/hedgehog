import { FraudulentStatus } from 'lib/fraudulentStatus'
import React from 'react'
import styled from 'react-emotion'
import { Icon } from 'semantic-ui-react'

const IconStyled = styled(Icon)(() => ({
  verticalAlign: 'middle',
}))

export function OrbIndicator(props) {
  return (
    <p style={{ marginTop: '-7px' }}>
      <b>{props.text}</b>
      <span style={{ fontSize: '32px' }}>
        <IconStyled
          name="circle"
          // Sets default to grey and tiny
          color={props.color.replace('amber', 'orange') || 'grey'}
          size={props.size || 'tiny'}
        />
      </span>
    </p>
  )
}
