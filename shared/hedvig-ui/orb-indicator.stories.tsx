import { OrbIndicator } from 'hedvig-ui/orb-indicator'
import React from 'react'

export default {
  title: 'OrbIndicator',
  component: OrbIndicator,
  decorators: [],
}

export const OrbStatusIndicator: React.FunctionComponent = () => {
  const [color, size, text] = React.useState('')
  return (
    <>
      <OrbIndicator color={color} size={size} />
      <p>
        <strong>Color:</strong> {color}
      </p>
      <p>
        <strong>Size:</strong> {size}
      </p>
      <p>
        <strong>Text:</strong> {text}
      </p>
    </>
  )
}
