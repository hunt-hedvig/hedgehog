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

const getPaddingFromSize = (size?: BadgeSize) => {
  switch (size) {
    case 'small':
      return '0.5rem 0.5rem'
    case 'medium':
      return '0.7rem 0.7rem'
    case 'large':
      return '0.9rem 0.9rem'
    default:
      return '0.5rem 0.5rem'
  }
}

const getColorFromVariant = (theme: any, variant?: BadgeVariant) => {
  switch (variant) {
    case 'danger':
      return theme.danger
    case 'warning':
      return theme.warning
    case 'success':
      return theme.success
    default:
      return theme.accent
  }
}

export const Badge = styled.div<BadgeProps>`
  display: inline-block;
  padding: ${({ size }) => getPaddingFromSize(size)};
  line-height: 1;
  background: ${({ theme, variant }) => getColorFromVariant(theme, variant)};
  border-radius: 13px;
  color: ${({ theme }) => theme.accentContrast};
  font-weight: ${({ bold = false }) => (bold ? 'bold' : 'normal')};
  width: ${({ fluid = false }) => (fluid ? '100%' : 'auto')};
  text-align: ${({ centered = true }) => (centered ? 'center' : 'left')};
`
