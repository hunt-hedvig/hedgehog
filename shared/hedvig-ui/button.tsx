import { colorsV2 } from '@hedviginsurance/brand'
import styled from 'react-emotion'
import {
  Button as SemanticButton,
  ButtonProps as SemanticButtonProps,
} from 'semantic-ui-react'

export interface ButtonProps extends SemanticButtonProps {
  variation?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  fullWidth?: boolean
}

export const buttonColorMap: Record<
  NonNullable<ButtonProps['variation']>,
  { foreground: string; background: string }
> = {
  primary: { foreground: colorsV2.white, background: colorsV2.violet500 },
  secondary: { foreground: colorsV2.white, background: colorsV2.midnight500 },
  success: { foreground: colorsV2.white, background: colorsV2.ocean700 },
  danger: { foreground: colorsV2.white, background: colorsV2.coral700 },
  warning: { foreground: '#000', background: colorsV2.sunflower500 },
}

export const Button = styled(SemanticButton)<ButtonProps>(
  ({ variation = 'primary', fullWidth, basic }) => ({
    '&&&': {
      whiteSpace: 'nowrap',
      background: basic
        ? 'transparent'
        : buttonColorMap[variation].background + ' !important',
      color:
        (basic
          ? buttonColorMap[variation].background
          : buttonColorMap[variation].foreground) + ' !important',
      border: `1px solid ${buttonColorMap[variation].background} !important`,
      boxShadow: 'none !important',
      width: fullWidth ? '100%' : 'auto',

      '&:hover, &:focus': {
        background: buttonColorMap[variation].background + ' !important',
        color: buttonColorMap[variation].foreground + ' !important',
      },
    },
  }),
)
