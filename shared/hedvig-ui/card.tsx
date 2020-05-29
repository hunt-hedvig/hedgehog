import { colorsV3 } from '@hedviginsurance/brand'
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
  padding: 2rem;
  align-items: flex-start;
  flex-direction: column;
  flex-grow: 1;
  color: ${({ theme }) => theme.foreground ?? colorsV3.gray900};
  background-color: ${({ theme }) => theme.accentLighter ?? colorsV3.white};
  border: 1px solid ${({ theme }) => theme.border ?? colorsV3.gray300};
  border-radius: 0.5rem;
`
