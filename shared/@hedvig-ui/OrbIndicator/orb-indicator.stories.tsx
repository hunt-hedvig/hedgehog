import { OrbIndicator } from '@hedvig-ui'
import React from 'react'

export default {
  title: 'OrbIndicator',
  component: OrbIndicator,
  decorators: [],
}

export const OrbStatusIndicator: React.FC = () => {
  return (
    <>
      <h2>Options:</h2>
      <p>
        Color: <br /> 'red' | 'orange' | 'yellow' | 'olive' | 'green' | 'teal' |
        'blue' | 'violet' | 'purple' | 'pink' | 'brown' | 'grey' | 'black'
      </p>
      <p>
        Size: <br /> 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' |
        'massive'{' '}
      </p>
      <h2>Examples:</h2>
      <p>
        Grey & Tiny (Default): <OrbIndicator />
      </p>
      <p>
        Green & Large: <OrbIndicator color="green" size="large" />
      </p>
      <p>
        Purple & Small: <OrbIndicator color="purple" size="small" />
      </p>
    </>
  )
}
