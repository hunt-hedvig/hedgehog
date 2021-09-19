import styled from '@emotion/styled'

export const Flex = styled.div<{
  direction?: string
  justify?: string
  align?: string
  span?: number
  fullWidth?: boolean
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'flex-start' }) => align};
  flex: ${({ span = 1 }) => span};
  width: ${({ fullWidth = true }) => (fullWidth ? '100%' : 'auto')};
`
