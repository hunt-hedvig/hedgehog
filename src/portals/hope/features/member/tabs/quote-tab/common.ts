import styled from '@emotion/styled'

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
export const ActionsWrapper = styled('div')(({ theme }) => ({
  background: theme.backgroundTransparent,
  width: '100%',
  padding: '1rem',
  borderRadius: '0.5rem',
  marginBottom: '1rem',
}))
