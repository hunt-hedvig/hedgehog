import styled from 'react-emotion'
import { colorsV2 } from '@hedviginsurance/brand/index'

export const ErrorMessage = styled('pre')({
  paddingTop: '1rem',
  color: 'red',
})
export const BottomSpacerWrapper = styled('div')({
  paddingBottom: '1rem',
})
export const Muted = styled('div')({
  opacity: 0.8,
})
export const ActionsWrapper = styled('div')({
  background: colorsV2.flamingo200,
  padding: '1rem',
  width: '100%',
  marginBottom: '1rem',
})
