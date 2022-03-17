import React, { useRef } from 'react'
import styled from '@emotion/styled'
import { Portal } from 'react-portal'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useClickOutside } from '@hedvig-ui/hooks/use-click-outside'
import { FadeIn, FadeInProps } from '../animations/fade-in'

const getPosition = (
  firstCondition: 'top' | 'bottom' | 'left' | 'right',
  secondCondition: 'top' | 'bottom' | 'left' | 'right',
  position?: string,
) =>
  position === firstCondition
    ? 'flex-start'
    : position === secondCondition
    ? 'flex-end'
    : 'center'

const Wrapper = styled.div<{
  position?: 'top' | 'center' | 'bottom'
  side?: 'left' | 'center' | 'right'
  noDimBg?: boolean
}>`
  background-color: ${({ theme, noDimBg }) =>
    noDimBg ? 'none' : theme.backgroundTransparent};

  width: 100vw;
  height: 100vh;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 1002;

  display: flex;
  align-items: ${({ position }) => getPosition('top', 'bottom', position)};
  justify-content: ${({ side }) => getPosition('left', 'right', side)};

  padding: 3rem;
`

const Container = styled(FadeIn)`
  max-width: 90%;
  max-height: 90%;

  box-shadow: 0 5px 40px ${({ theme }) => theme.backgroundTransparent};
  border-radius: 0.5rem;

  overflow: auto;

  background: ${({ theme }) => theme.background};
`

export interface ModalAdditionalOptions {
  disableClickOutside?: boolean
  position?: 'top' | 'center' | 'bottom'
  side?: 'left' | 'center' | 'right'
  noDimBg?: boolean
}

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    FadeInProps {
  onClose: () => void
  options?: ModalAdditionalOptions
}

export const Modal: React.FC<ModalProps> = ({
  onClose,
  children,
  options,
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  const clickOutsideCloseHandler = () =>
    !options?.disableClickOutside && onClose()

  useClickOutside(modalRef, clickOutsideCloseHandler)
  useKeyIsPressed(Keys.Escape, () => onClose())

  return (
    <Portal>
      <Wrapper {...options}>
        <Container ref={modalRef} duration={props.duration || 250} {...props}>
          {children}
        </Container>
      </Wrapper>
    </Portal>
  )
}
