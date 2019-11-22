import { colorsV2 } from '@hedviginsurance/brand'
import styled from 'react-emotion'
import { Button } from 'semantic-ui-react'

export const SubmitButton = styled(Button)({
  '&&': {
    whiteSpace: 'nowrap',
    width: '100%',
    background: colorsV2.ocean700,
    color: '#fff',
    '&:hover, &:focus': {
      background: colorsV2.grass500,
      color: '#fff',
    },
  },
})
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
