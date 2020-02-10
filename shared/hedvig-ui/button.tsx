import { colorsV2 } from '@hedviginsurance/brand'
import styled from 'react-emotion'
import {
  Button as SemanticButton,
  ButtonProps as SemanticButtonProps,
} from 'semantic-ui-react'

export interface ButtonProps extends SemanticButtonProps {
  type: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  fullWidth?: boolean
}

export const buttonColorMap: Record<
  ButtonProps['type'],
  { foreground: string; background: string }
> = {
  primary: { foreground: colorsV2.white, background: colorsV2.violet500 },
  secondary: { foreground: colorsV2.white, background: colorsV2.midnight500 },
  success: { foreground: colorsV2.white, background: colorsV2.ocean700 },
  error: { foreground: colorsV2.white, background: colorsV2.coral700 },
  warning: { foreground: '#000', background: colorsV2.sunflower500 },
}

export const Button = styled(SemanticButton)<ButtonProps>(
  ({ type, fullWidth }) => ({
    '&&': {
      whiteSpace: 'nowrap',
      background: buttonColorMap[type].background,
      color: buttonColorMap[type].foreground,
      width: fullWidth ? '100%' : 'auto',

      '&:hover, &:focus': {
        background: buttonColorMap[type].background,
        color: buttonColorMap[type].foreground,
      },
    },
  }),
)
