import styled from '@emotion/styled'
import React from 'react'
import { MonetaryAmountV2 } from 'types/generated/graphql'

export const MainHeadline = styled('h1')``
export const SecondLevelHeadline = styled('h2')``
export const ThirdLevelHeadline = styled('h3')``
export const FourthLevelHeadline = styled('h4')`
  margin-block-start: 0;
  margin-block-end: 0;
`
export const Paragraph = styled.p<{ secondary?: boolean }>`
  color: ${({ secondary, theme }) => secondary && theme.semiStrongForeground};
`

export const Label = styled.label`
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
  color: ${({ theme }) => theme.semiStrongForeground};
  font-weight: normal;
`

export const Capitalized = styled.div`
  display: inline-block;
  ::first-letter {
    text-transform: uppercase;
  }
  text-transform: lowercase;
`

export const Placeholder = styled.span`
  color: ${({ theme }) => theme.placeholderColor};
`

export const Bold = styled.strong`
  color: inherit !important;
`

export const Shadowed = styled.span`
  background-color: ${({ theme }) => theme.backgroundTransparent};
  border-radius: 4px;
  padding: 0.1em 0.35em;
`

const MonetaryAmount = styled.span`
  border-bottom: 1px solid ${({ theme }) => theme.foreground};
`

const MonetaryCurrency = styled.span`
  font-size: 0.7em;
`

export const Monetary: React.FC<{ amount: MonetaryAmountV2 }> = ({
  amount,
}) => {
  return (
    <MonetaryAmount>
      {Number(amount.amount).toLocaleString(undefined, { useGrouping: true })}{' '}
      <MonetaryCurrency>{amount.currency}</MonetaryCurrency>
    </MonetaryAmount>
  )
}

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.danger};
  font-weight: bold;
`

interface HotkeyProps {
  hotkey?: string
  hinting: boolean
  dark?: boolean
  children: React.ReactNode
}

const HotkeyWrapper = styled.div`
  position: relative;
`

export const HotkeyStyled = styled(Shadowed)<{ dark?: boolean }>`
  position: absolute;
  right: -1.75rem;
  top: 0;
  font-size: 1rem;
  background-color: ${({ dark, theme }) =>
    !dark ? theme.backgroundTransparentContrast : theme.backgroundTransparent};
`

export const Hotkey = (props: HotkeyProps) => {
  return (
    <HotkeyWrapper>
      {props.children}
      {props.hinting && props.hotkey && (
        <HotkeyStyled dark={props.dark}>{props.hotkey}</HotkeyStyled>
      )}
    </HotkeyWrapper>
  )
}
