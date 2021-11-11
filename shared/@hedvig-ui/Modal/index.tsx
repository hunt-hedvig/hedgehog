import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FadeIn } from '@hedvig-ui'
import React, { useRef } from 'react'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { Portal } from 'react-portal'
import { useClickOutside } from '../hooks/use-click-outside'

const ModalWrapperStyled = styled.div<{
  position?: 'top' | 'center' | 'bottom'
  side?: 'left' | 'center' | 'right'
  dim: boolean
}>`
  width: 100vw;
  height: 100vh;

  ${({ dim, theme }) =>
    dim &&
    css`
      background-color: ${theme.backgroundTransparent};
    `};

  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  display: flex;
  align-items: ${({ position }) =>
    position === 'top'
      ? 'flex-start'
      : position === 'bottom'
      ? 'flex-end'
      : 'center'};
  justify-content: ${({ side }) =>
    side === 'left' ? 'flex-start' : side === 'right' ? 'flex-end' : 'center'};
  padding: 50px;
`

const ModalContent = styled.div<{
  width?: string
  height?: string
}>`
  width: ${({ width }) => width || 'auto'};
  max-width: 900px;
  height: ${({ height }) => height || 'auto'};
  max-height: 950px;

  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 5px 40px ${({ theme }) => theme.backgroundTransparent};

  display: flex;
  flex-direction: column;
`

const ModalHeader = styled.div`
  box-sizing: content-box;

  display: grid;
  grid-template-columns: 1fr 20px;
  column-gap: 10px;
  align-items: center;

  padding: 10px 15px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  .modal-title {
    flex: 1;
    color: ${({ theme }) => theme.foreground};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .modal-close {
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: ${({ theme }) => theme.foreground};
  }
`

const ModalBody = styled.div`
  flex: 1;
  padding: 15px;
  color: ${({ theme }) => theme.foreground};
`

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'top' | 'center' | 'bottom'
  side?: 'left' | 'center' | 'right'
  height?: string
  width?: string
  title?: string
  withoutHeader?: boolean
  disableClickOutside?: boolean
  onClose: () => void
  dimBackground?: boolean
}

export const Modal = (props: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  const clickOutsideCloseHandler = () => {
    if (!props.disableClickOutside) {
      return props.onClose()
    } else {
      return
    }
  }

  useClickOutside(modalRef, clickOutsideCloseHandler)

  return (
    <Portal>
      <ModalWrapperStyled
        position={props.position}
        side={props.side}
        dim={props.dimBackground ?? true}
      >
        <FadeIn duration={250}>
          <ModalContent
            className="modal"
            ref={modalRef}
            height={props.height}
            width={props.width}
            style={props.style}
          >
            {!props.withoutHeader && (
              <ModalHeader className="modal__header">
                <span className="modal-title" title={props.title}>
                  {props.title}
                </span>
                <CloseIcon className="modal-close" onClick={props.onClose} />
              </ModalHeader>
            )}
            <ModalBody className="modal__body">{props.children}</ModalBody>
          </ModalContent>
        </FadeIn>
      </ModalWrapperStyled>
    </Portal>
  )
}
