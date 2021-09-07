import styled from '@emotion/styled'
import React, { useEffect, useRef } from 'react'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { Portal } from 'react-portal'

export const useClickOutside = (ref: any, handler: (e: any) => void) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

const ModalWrapperStyled = styled.div<{
  position?: 'top' | 'center' | 'bottom'
  side?: 'left' | 'center' | 'right'
}>`
  width: 100vw;
  height: 100vh;

  padding: 50px;

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

  background-color: rgba(0, 0, 0, 0.3);
`

const ModalContent = styled.div<{ height?: string; width?: string }>`
  width: ${({ width }) => width || '350px'};
  max-width: 900px;

  height: ${({ height }) => height || '150px'};
  max-height: 600px;

  border-radius: 0.5rem;

  display: flex;
  flex-direction: column;

  background-color: #ffffff;
`

const ModalHeader = styled.div`
  height: 40px;

  padding: 0 15px;

  display: grid;
  grid-template-columns: 1fr 20px;
  column-gap: 10px;
  align-items: center;

  box-sizing: content-box;

  border-bottom: 1px solid #cccccc;

  .modal-title {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .modal-close {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`

const ModalBody = styled.div`
  flex: 1;
  width: 100%;
  padding: 15px;
`

export interface ModalProps {
  position?: 'top' | 'center' | 'bottom'
  side?: 'left' | 'center' | 'right'
  height?: string
  width?: string
  title?: string
  withoutHeader?: boolean
  disableClickOutside?: boolean
  close: () => void
  children: any
}

export const Modal = (props: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  const clickOutsideCloseHandler = () => {
    if (!props.disableClickOutside) {
      return props.close()
    } else {
      return
    }
  }

  useClickOutside(modalRef, clickOutsideCloseHandler)

  return (
    <Portal>
      <ModalWrapperStyled position={props.position} side={props.side}>
        <ModalContent ref={modalRef} height={props.height} width={props.width}>
          {!props.withoutHeader && (
            <ModalHeader>
              <span className="modal-title" title={props.title}>
                {props.title}
              </span>
              <CloseIcon className="modal-close" onClick={props.close} />
            </ModalHeader>
          )}
          <ModalBody>{props.children}</ModalBody>
        </ModalContent>
      </ModalWrapperStyled>
    </Portal>
  )
}
