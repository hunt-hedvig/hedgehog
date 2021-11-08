import styled from '@emotion/styled'
import { Button, Flex } from '@hedvig-ui'
import React, { HTMLAttributes } from 'react'

interface AccessListItemProps extends HTMLAttributes<HTMLDivElement> {
  access?: boolean
  spacing: boolean
  canGrant?: boolean
  onGrant?: () => void
}

const Wrapper = styled.div<{
  access?: boolean
  spacing: boolean
}>`
  font-size: 1rem;
  background-color: ${({ theme, access = false }) =>
    access ? theme.accentLighter : theme.backgroundTransparent};
  color: ${({ theme, access }) => (access ? theme.accent : theme.foreground)};
  padding: 0.5em 0.9em;
  border-radius: 6px;
  width: 100%;
  margin-top: ${({ spacing }) => (spacing ? '0.5rem' : '0')};
`

export const AccessListItem: React.FC<AccessListItemProps> = ({
  children,
  canGrant,
  onGrant,
  ...props
}) => {
  return (
    <Wrapper {...props}>
      <Flex align="center" justify="space-between">
        {children}
        {canGrant && onGrant && (
          <Button size="small" variant="tertiary" onClick={onGrant}>
            Grant access
          </Button>
        )}
      </Flex>
    </Wrapper>
  )
}
