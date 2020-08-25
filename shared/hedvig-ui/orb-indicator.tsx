import { Flag } from 'api/generated/graphql'
import React from 'react'
import styled from 'react-emotion'
import { Icon, SemanticCOLORS } from 'semantic-ui-react'
import { IconSizeProp } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'

const IconStyled = styled(Icon)(() => ({
  verticalAlign: 'middle',
  paddingLeft: '4px',
}))

const Container = styled('p')(() => ({
  marginTop: '-7px',
  display: 'inline',
}))

interface FlagOrbProps {
  flag?: Flag | null
  size?: IconSizeProp
}

interface OrbProps {
  color?: SemanticCOLORS | null
  size?: IconSizeProp
}

export const FlagOrbIndicator: React.FunctionComponent<FlagOrbProps> = ({
  flag,
  size,
}) => <OrbIndicator color={getColorOfFlag(flag)} size={size} />

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

const getColorOfFlag = (
  flag?: Flag | null,
): SemanticCOLORS | undefined | null => {
  if (flag === Flag.Green) {
    return 'green'
  }
  if (flag === Flag.Amber) {
    return 'orange'
  }
  if (flag === Flag.Red) {
    return 'red'
  }
  return flag
}
