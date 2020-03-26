import { colorsV2 } from '@hedviginsurance/brand'
import styled from 'react-emotion'

export const ButtonsGroup = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '1rem',
  'button:not(:last-of-type)': {
    marginRight: '0.5rem',
  },
  'button:not(:first-of-type)': {
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
  basic?: boolean
  size?: 'small' | 'medium' | 'large'
}

export const buttonColorMap: Record<
  NonNullable<ButtonProps['variation']>,
  { foreground: string; background: string; highlighted: string }
> = {
  default: {
    foreground: colorsV2.white,
    background: colorsV2.darkgray,
    highlighted: colorsV2.gray,
  },
  primary: {
    foreground: colorsV2.white,
    background: colorsV2.violet500,
    highlighted: colorsV2.violet300,
  },
  secondary: {
    foreground: colorsV2.white,
    background: colorsV2.midnight500,
    highlighted: colorsV2.midnight300,
  },
  success: {
    foreground: colorsV2.white,
    background: colorsV2.ocean500,
    highlighted: colorsV2.ocean300,
  },
  danger: {
    foreground: colorsV2.white,
    background: colorsV2.coral500,
    highlighted: colorsV2.coral300,
  },
  warning: {
    foreground: '#000',
    background: colorsV2.sunflower500,
    highlighted: colorsV2.sunflower300,
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
  ({ variation = 'default', fullWidth, basic, size = 'medium' }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    fontSize: buttonSizeMap[size].fontSize,
    padding: buttonSizeMap[size].padding,
    width: fullWidth ? '100%' : 'auto',
    background: basic ? 'transparent' : buttonColorMap[variation].background,
    color: basic
      ? buttonColorMap[variation].background
      : buttonColorMap[variation].foreground,
    border: `1px solid ${buttonColorMap[variation].background}`,
    boxShadow: 'none !important',
    borderRadius: 5,
    cursor: 'pointer',
    '&:hover, &:focus': {
      outline: 'none',
      colors: buttonColorMap[variation].foreground,
      background: buttonColorMap[variation].highlighted,
      borderColor: buttonColorMap[variation].highlighted,
    },
    '&:disabled': {
      background: colorsV2.semilightgray,
      color: colorsV2.white,
      borderColor: colorsV2.semilightgray,
    },
  }),
)

export const ButtonLink = Button.withComponent('a')
