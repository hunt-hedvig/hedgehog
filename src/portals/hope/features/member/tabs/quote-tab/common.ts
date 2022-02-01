import styled from '@emotion/styled'
import chroma from 'chroma-js'

export const ErrorMessage = styled('pre')({
  paddingTop: '1rem',
  color: 'red',
})
export const BottomSpacerWrapper = styled('div')({
  paddingBottom: '1rem',
})

export const Muted = styled.div`
  opacity: 0.7;
`

export const ActionsWrapper = styled.div`
  background-color: ${({ theme }) =>
    chroma(theme.accent).alpha(0.1).brighten(1).hex()};

  border-radius: 0.5rem;

  display: flex;
  flex-wrap: wrap;

  background-color: ${({ theme }) =>
    chroma(theme.accent).alpha(0.1).brighten(1).hex()};

  padding: 0.25rem 0.7rem;

  margin: 0 1rem 1rem 0;

  > div {
    width: 100%;
    padding: 0.5rem;
  }
`
