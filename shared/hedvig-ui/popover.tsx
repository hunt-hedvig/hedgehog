import React, { useState } from 'react'
import styled, { css } from 'react-emotion'

const PopoverWrapper = styled.div`
  position: relative;
  display: inline-block;
`

const Contents = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, calc(-100% - 0.25rem));
  padding: 0.5rem;
  border-radius: 0.25rem;

  ${({ theme }) => css`
    background: ${theme.foreground};
    color: ${theme.background};
  `}
`
const Triangle = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 100%);
  width: 0;
  height: 0;
  border-left: 0.5rem solid transparent;
  border-right: 0.5rem solid transparent;
  border-top: 0.5rem solid ${({ theme }) => theme.foreground};
`

interface PopoverProps {
  contents: React.ReactNode
  className?: string
  disable?: boolean
  onOpen?: () => void
  onClose?: () => void
}
export const Popover: React.FC<PopoverProps> = ({
  contents,
  className,
  disable,
  onOpen,
  onClose,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <PopoverWrapper
      className={className}
      onMouseOver={() => {
        setIsOpen(true)
        if (onOpen) {
          onOpen()
        }
      }}
      onMouseLeave={() => {
        setIsOpen(false)
        if (onClose) {
          onClose()
        }
      }}
    >
      {isOpen && !disable && (
        <Contents>
          {contents}
          <Triangle />
        </Contents>
      )}
      {children}
    </PopoverWrapper>
  )
}
