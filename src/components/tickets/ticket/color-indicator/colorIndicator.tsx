import React from 'react'
import styled from 'react-emotion'

import { GREEN, interpolateBetweenColors, ORANGE, RED, YELLOW } from './colors'

export const Circle = styled('span')`
  border-radius: 50%;
  width: 10px;
  height: 10px;
  display: inline-block;
  margin: 0 5px;

  background-color: ${(props: IColorIndicator) => {
    if (props.percentage >= 0.66) {
      return interpolateBetweenColors(ORANGE, RED, props.percentage)
    } else if (props.percentage > 0.33 && props.percentage < 0.66) {
      return interpolateBetweenColors(YELLOW, ORANGE, props.percentage)
    } else if (props.percentage < 0.33) {
      return interpolateBetweenColors(GREEN, YELLOW, props.percentage)
    } else {
      return 'seashell'
    }
  }};
`

interface IColorIndicator {
  percentage: number
}

export const ColorIndicator = (props: IColorIndicator) => (
  <Circle percentage={props.percentage} />
)

