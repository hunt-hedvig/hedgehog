import { colorsV2 } from '@hedviginsurance/brand'
import styled from 'react-emotion'

export const CardsWrapper = styled('div')`
  width: calc(100% + 1rem);
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
  min-width: ${({ span }) => `calc(100%/${span ?? 1} - 1rem)`};
  margin: 0.5rem;
  padding: 1rem;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  background-color: ${colorsV2.white};
  border: 1px solid ${colorsV2.lightgray};
`
