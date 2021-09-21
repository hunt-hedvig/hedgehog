import styled from '@emotion/styled'

export const Flex = styled.div<{
  direction?: string
  justify?: string
  align?: string
  fullWidth?: boolean
  flex?: string
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'flex-start' }) => align};
  flex: ${({ flex = '1' }) => flex};
  width: ${({ fullWidth = true }) => (fullWidth ? '100%' : 'auto')};
`
