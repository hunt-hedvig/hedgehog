import { css } from '@emotion/react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import React from 'react'

const color = ({
  theme,
  variant = 'primary',
  status = '',
  disabled = false,
}) => {
  if (disabled) {
    return css`
      color: ${chroma(theme.semiStrongForeground)
        .brighten(0.5)
        .hex()};
    `
  }

  if (status === 'success') {
    return css`
      color: ${theme.accentContrast};
    `
  }
  if (status === 'warning') {
    return css`
      color: ${theme.accentContrast};
    `
  }
  if (status === 'danger') {
    return css`
      color: ${theme.accentContrast};
    `
  }

  if (variant === 'primary') {
    return css`
      color: ${theme.accentContrast};
    `
  }

  if (variant === 'secondary') {
    return css`
      color: ${theme.accent};
    `
  }

  if (variant === 'tertiary') {
    return css`
      color: ${theme.accent};
    `
  }
}

const backgroundColor = ({
  theme,
  variant = 'primary',
  status = '',
  disabled = false,
}) => {
  if (disabled) {
    return css`
      background-color: ${chroma(theme.mutedBackground)
        .darken(0.4)
        .hex()};
    `
  }

  if (status === 'success') {
    return css`
      background-color: ${theme.success};
      :hover {
        background-color: ${chroma(theme.success)
          .brighten(0.5)
          .hex()};
      }
    `
  }

  if (status === 'warning') {
    return css`
      background-color: ${theme.warning};
      :hover {
        background-color: ${chroma(theme.warning)
          .brighten(0.5)
          .hex()};
      }
    `
  }

  if (status === 'danger') {
    return css`
      background-color: ${theme.danger};
      :hover {
        background-color: ${chroma(theme.danger)
          .brighten(0.5)
          .hex()};
      }
    `
  }

  if (variant === 'primary') {
    return css`
      background-color: ${theme.accent};
      :hover {
        background-color: ${chroma(theme.accent)
          .brighten(0.5)
          .hex()};
      }
    `
  }

  if (variant === 'secondary') {
    return css`
      background-color: ${theme.accentLight};
      :hover {
        background-color: ${chroma(theme.accentLight)
          .brighten(0.2)
          .hex()};
      }
    `
  }

  if (variant === 'tertiary') {
    return css`
      background-color: transparent;
      :hover {
        background-color: ${chroma(theme.accentLight)
          .brighten(0.2)
          .hex()};
      }
    `
  }
}

const border = () => {
  return css`
    border: none;
    border-radius: 6px;
  `
}

const padding = ({ size = 'medium' }) => {
  if (size === 'small') {
    return css`
      padding: 0.5rem 0.75rem;
    `
  }

  if (size === 'medium') {
    return css`
      padding: 0.75rem 1rem;
    `
  }

  if (size === 'large') {
    return css`
      padding: 1rem 1.5rem;
    `
  }
}

const fontSize = ({ size = 'medium' }) => {
  if (size === 'small') {
    return css`
      font-size: 0.75rem;
    `
  }

  if (size === 'medium') {
    return css`
      font-size: 1rem;
    `
  }

  if (size === 'large') {
    return css`
      font-size: 1.5rem;
    `
  }
}

const cursor = ({ disabled = false }) => {
  if (!disabled) {
    return css`
      cursor: pointer;
    `
  }

  return css`
    cursor: default;
  `
}

const ButtonIcon = styled.span<{ size?: 'small' | 'medium' | 'large' }>`
  width: 1em;
  height: 1em;
  margin-right: ${({ size = 'medium' }) =>
    size === 'small' ? '0.5rem' : size === 'medium' ? '0.75rem' : '1rem'};
`

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary'
  status?: 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export const Button = styled(({ icon, children, ...props }: ButtonProps) => (
  <button {...props}>
    {!!icon && <ButtonIcon size={props.size}>{icon}</ButtonIcon>}
    {children}
  </button>
))`
  display: inline-flex;
  align-items: center;
  font-family: inherit;
  transition: all 200ms;

  ${cursor};
  ${color};
  ${backgroundColor};
  ${border};
  ${padding};
  ${fontSize};
`
