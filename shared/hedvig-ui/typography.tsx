import styled from '@emotion/styled'

export const MainHeadline = styled('h1')``
export const SecondLevelHeadline = styled('h2')``
export const ThirdLevelHeadline = styled('h3')``
export const FourthLevelHeadline = styled('h4')`
  margin-block-start: 0;
  margin-block-end: 0;
`
export const Paragraph = styled.p``

export const Label = styled('p')`
  font-size: 0.95rem;
  margin-bottom: 0.4em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const Capitalized = styled.div`
  display: inline-block;
  ::first-letter {
    text-transform: uppercase;
  }
  text-transform: lowercase;
`

export const Placeholder = styled.div`
  && {
    display: inline-block;
    color: ${({ theme }) => theme.placeholderColor};
  }
`

export const Bold = styled.strong`
  color: inherit !important;
`

export const Shadowed = styled.span`
  background-color: ${({ theme }) => theme.backgroundTransparent};
  border-radius: 4px;
  padding: 0.1em 0.35em;
`

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.danger};
  font-weight: bold;
`
