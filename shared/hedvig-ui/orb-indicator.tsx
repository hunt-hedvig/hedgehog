import React from 'react'
import styled from 'react-emotion'
import { Icon } from 'semantic-ui-react'
import { SemanticCOLORS } from 'semantic-ui-react'
import { IconSizeProp } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'

const IconStyled = styled(Icon)(() => ({
  verticalAlign: 'middle',
  paddingLeft: '4px',
}))

const Container = styled('p')(() => ({
  marginTop: '-7px',
  display: 'inline',
}))

interface OrbProps {
  color?: Flag | string | null
  size?: IconSizeProp
}

enum Flag {
  GREEN = 'green',
  AMBER = 'orange',
  RED = 'red',
}

export const OrbIndicator: React.FunctionComponent<OrbProps> = ({
  color,
  size,
}) => {
  return (
    <Container>
      <span style={{ fontSize: '32px' }}>
        <IconStyled
          name="circle"
          color={(color?.toLowerCase() || 'grey') as SemanticCOLORS}
          size={size || 'tiny'}
        />
      </span>
    </Container>
  )
}
