import { colorsV2 } from '@hedviginsurance/brand'
import styled from 'react-emotion'

export const ButtonsGroup = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  margin: '-0.5rem 0rem',
  paddingTop: '1rem',
  '&& button': {
    flex: '1 1 0',
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
  float?: 'none' | 'left' | 'right'
}

export const buttonColorMap: Record<
  NonNullable<ButtonProps['variation']>,
  { foreground: string; background: string }
> = {
  default: { foreground: colorsV2.white, background: colorsV2.darkgray },
  primary: { foreground: colorsV2.white, background: colorsV2.violet500 },
  secondary: { foreground: colorsV2.white, background: colorsV2.midnight500 },
  success: { foreground: colorsV2.white, background: colorsV2.ocean700 },
  danger: { foreground: colorsV2.white, background: colorsV2.coral700 },
  warning: { foreground: '#000', background: colorsV2.sunflower500 },
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
    basic,
    size = 'medium',
    float = 'none',
  }) => ({
    float,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    fontSize: buttonSizeMap[size].fontSize,
    padding: buttonSizeMap[size].padding,
    margin: '0.5rem',
    width: fullWidth ? 'calc(100% - 1rem)' : 'auto',
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
      opacity: '0.8',
      background: buttonColorMap[variation].background,
      color: buttonColorMap[variation].foreground,
    },
    '&:disabled': {
      background: colorsV2.semilightgray,
      color: colorsV2.white,
      border: `1px solid ${colorsV2.semilightgray}`,
    },
  }),
)
