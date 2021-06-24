import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'

export const CardsWrapper = styled.div<{ contentWrap?: string }>`
  width: calc(100% + 1rem);
  display: flex;
  flex-direction: row;
  flex-wrap: ${({ contentWrap = 'wrap' }) => contentWrap};
  margin: 0rem -0.5rem;
`

type PaddingSize = 'none' | 'small' | 'medium' | 'large'

export const paddingMap: Record<PaddingSize, string> = {
  none: '0',
  small: '0.5rem',
  medium: '2rem',
  large: '3rem',
}

export interface CardProps {
  span?: number
  padding?: PaddingSize
}

export const Card = styled('div')<CardProps>`
  display: inline-flex;
  min-width: ${({ span }) => `calc(100%/${span ?? 1} - 1rem)`};
  margin: 0.5rem;
  padding: ${({ padding = 'medium' }) => paddingMap[padding]};
  align-items: flex-start;
  flex-direction: column;
  flex-grow: 1;
  color: ${({ theme }) => theme.foreground ?? colorsV3.gray900};
  background-color: ${({ theme }) => theme.accentLighter ?? colorsV3.white};
  border: 1px solid ${({ theme }) => theme.border ?? colorsV3.gray300};
  border-radius: 0.5rem;
`

export const DangerCard = styled(Card)<CardProps>`
  background-color: ${({ theme }) => theme.danger ?? colorsV3.white};
  border: 1px solid ${({ theme }) => theme.border ?? colorsV3.gray300};
`

export const CardContent = styled('div')`
  width: 100%;
`
