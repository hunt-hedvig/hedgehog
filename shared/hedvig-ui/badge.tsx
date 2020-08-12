import styled from 'react-emotion'

export type BadgeSize = 'small' | 'medium' | 'large'
export type BadgeVariant = 'danger' | 'warning' | 'success' | 'default'

export interface BadgeProps {
  size?: BadgeSize
  fluid?: boolean
  centered?: boolean
  bold?: boolean
  variant?: BadgeVariant
}

const mapBadgeSize = (size?: BadgeSize) => {
  if (size === 'small') {
    return '0.5rem 0.5rem'
  }

  if (size === 'medium') {
    return '0.7rem 0.7rem'
  }

  if (size === 'large') {
    return '0.9rem 0.9rem'
  }

  return '0.5rem 0.5rem'
}

const mapBadgeColor = (theme: any, variant?: BadgeVariant) => {
  if (variant === 'danger') {
    return theme.danger
  }

  if (variant === 'warning') {
    return theme.warning
  }

  if (variant === 'success') {
    return theme.success
  }

  return theme.accent
}

export const Badge = styled.div<BadgeProps>`
  display: inline-block;
  padding: ${({ size }) => mapBadgeSize(size)};
  line-height: 1;
  background: ${({ theme, variant }) => mapBadgeColor(theme, variant)};
  border-radius: 13px;
  color: ${({ theme }) => theme.accentContrast};
  font-weight: ${({ bold = false }) => (bold ? 'bold' : 'normal')};
  width: ${({ fluid = false }) => (fluid ? '100%' : 'auto')};
  text-align: ${({ centered = true }) => (centered ? 'center' : 'left')};
`
