import { colorsV2 } from '@hedviginsurance/brand'
import styled from 'react-emotion'

export const CardsWrapper = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: -0.5rem;
`

export interface CardProps {
  span?: number
}

export const Card = styled('div')<CardProps>`
  display: inline-flex;
  width: ${({ span }) => `calc(100%/${span ?? 1} - 1rem)`};
  margin: 0.5rem;
  padding: 1rem;
  align-items: center;
  flex-direction: column;
  background-color: ${colorsV2.white};
  border: 1px solid ${colorsV2.lightgray};
`
