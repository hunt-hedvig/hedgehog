import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import React from 'react'
import { LockFill } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'

export const CardsWrapper = styled.div<{ contentWrap?: string }>`
  width: calc(100% + 1rem);
  display: flex;
  flex-direction: row;
  flex-wrap: ${({ contentWrap = 'wrap' }) => contentWrap};
  margin: 0rem -0.5rem;
`

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(255 255 255 / 70%);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
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
  locked?: boolean
  to?: string
  children: any
}

const CardContainer = styled.div<CardProps>`
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
  position: relative;
`

export const CardLink = CardContainer.withComponent(Link)

export const Card = ({ children, locked, to, ...cardProps }: CardProps) => {
  const CardComponent = to ? CardLink : CardContainer
  return (
    <CardComponent to={to ?? ''} {...cardProps}>
      {children}
      {locked && (
        <LockedOverlay>
          Locked
          <LockFill />
        </LockedOverlay>
      )}
    </CardComponent>
  )
}

export const DangerCard = styled(Card)<CardProps>`
  background-color: ${({ theme }) => theme.danger ?? colorsV3.white};
  border: 1px solid ${({ theme }) => theme.border ?? colorsV3.gray300};
`

export const CardContent = styled('div')`
  width: 100%;
`
