import styled from '@emotion/styled'
import React from 'react'

export const OrbSizes = [
  'mini',
  'tiny',
  'small',
  'large',
  'big',
  'huge',
  'massive',
] as const

export const OrbColors = [
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink',
  'brown',
  'grey',
  'black',
] as const

export type SizeProp = typeof OrbSizes[number]

export type ColorProp = typeof OrbColors[number]

export type FlagProp = 'GREEN' | 'AMBER' | 'RED'

const colors = {
  red: '#db2828',
  orange: '#f2711c',
  yellow: '#fbbd08',
  olive: '#b5cc18',
  green: '#21ba45',
  teal: '#00b5ad',
  blue: '#2185d0',
  violet: '#6435c9',
  purple: '#a333c8',
  pink: '#e03997',
  brown: '#a5673f',
  grey: '#767676',
  black: '#1b1c1d',
}

const sizes = {
  mini: '11px',
  tiny: '14px',
  small: '21px',
  large: '41px',
  big: '55px',
  huge: '110px',
  massive: '220px',
}

interface OrbIndicatorProps {
  color?: ColorProp
  size?: SizeProp
  flag?: FlagProp
}

const OrbIndicatorStyled = styled.div<{ color: ColorProp; size: SizeProp }>`
  width: ${({ size }) => sizes[size]};
  height: ${({ size }) => sizes[size]};
  background-color: ${({ color }) => colors[color]};
  border-radius: 50%;
`

export const OrbIndicator: React.FC<OrbIndicatorProps> = ({
  color,
  size,
  flag,
}) => {
  const currentColor =
    !flag && color ? color : flag ? getFlagColor(flag) : 'grey'

  return (
    <OrbIndicatorStyled
      color={currentColor as ColorProp}
      size={size || 'tiny'}
    />
  )
}

const getFlagColor = (flag?: FlagProp | null) => {
  if (flag === 'AMBER') {
    return 'orange'
  }
  return flag?.toLowerCase()
}
