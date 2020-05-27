import { colorsV3 } from '@hedviginsurance/brand'
import styled from 'react-emotion'

export const ButtonsGroup = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  '*:not(:last-child)': {
    marginRight: '0.5rem',
  },
  '*:not(:first-child)': {
    marginLeft: '0.5rem',
  },
})

export interface ButtonProps {
  variation?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
  fullWidth?: boolean
  halfWidth?: boolean
  basic?: boolean
  size?: 'small' | 'medium' | 'large'
}

export const buttonColorMap: Record<
  NonNullable<ButtonProps['variation']>,
  { foreground: string; background: string; highlighted: string }
> = {
  default: {
    foreground: colorsV3.white,
    background: colorsV3.gray900,
    highlighted: colorsV3.gray700,
  },
  primary: {
    foreground: colorsV3.white,
    background: colorsV3.purple500,
    highlighted: colorsV3.purple300,
  },
  secondary: {
    foreground: colorsV3.white,
    background: colorsV3.gray900,
    highlighted: colorsV3.gray900,
  },
  success: {
    foreground: colorsV3.gray900,
    background: colorsV3.pistachio700,
    highlighted: colorsV3.pistachio500,
  },
  danger: {
    foreground: colorsV3.white,
    background: colorsV3.orange,
    highlighted: colorsV3.orange,
  },
  warning: {
    foreground: '#000',
    background: colorsV3.canary,
    highlighted: colorsV3.canary,
  },
}

export const buttonSizeMap: Record<
  NonNullable<ButtonProps['size']>,
  { fontSize: string; padding: string }
> = {
  small: {
    fontSize: '0.75rem',
    padding: '0.5rem 0.75rem',
  },
  medium: {
    fontSize: '1rem',
    padding: '0.75rem 1rem',
  },
  large: {
    fontSize: '1.25rem',
    padding: '1rem 1.5rem',
  },
}

export const Button = styled('button')<ButtonProps>(
  ({
    variation = 'default',
    fullWidth,
    halfWidth,
    basic,
    size = 'medium',
  }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    fontSize: buttonSizeMap[size].fontSize,
    fontFamily: 'inherit',
    padding: buttonSizeMap[size].padding,
    width: fullWidth ? '100%' : 'auto',
    minWidth: halfWidth ? '50%' : 'auto',
    background: basic ? 'transparent' : buttonColorMap[variation].background,
    color:
      (basic
        ? buttonColorMap[variation].background
        : buttonColorMap[variation].foreground) + ' !important',
    border: `1px solid ${buttonColorMap[variation].background}`,
    boxShadow: 'none !important',
    borderRadius: 5,
    cursor: 'pointer',
    '&:hover, &:focus': {
      outline: 'none',
      color: buttonColorMap[variation].foreground,
      background: buttonColorMap[variation].highlighted,
      borderColor: buttonColorMap[variation].highlighted,
    },
    '&:disabled': {
      background: colorsV3.gray500,
      color: colorsV3.white,
      borderColor: colorsV3.gray500,
    },
  }),
)

export const ButtonLink = Button.withComponent('a')
