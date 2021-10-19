import styled from '@emotion/styled'
import React from 'react'
import { lightTheme } from '..'

export type FlagProp = 'GREEN' | 'AMBER' | 'RED'

interface OrbIndicatorProps {
  color?: string
  size?: string
  flag?: FlagProp
}

const OrbIndicatorStyled = styled.div<{ color: string; size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: ${({ color }) => color};
  border-radius: 50%;
`

export const OrbIndicator: React.FC<OrbIndicatorProps> = ({
  color,
  size,
  flag,
}) => {
  const currentColor =
    !flag && color
      ? color
      : flag
      ? getFlagColor(flag)
      : lightTheme.placeholderColor

  return <OrbIndicatorStyled color={currentColor} size={size || 'tiny'} />
}

const getFlagColor = (flag?: FlagProp | null) => {
  if (flag === 'AMBER') {
    return '#f2711c'
  }
  if (flag === 'RED') {
    return lightTheme.danger
  }

  return '#21ba45'
}
