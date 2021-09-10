import styled from '@emotion/styled'
import { FadeIn } from '@hedvig-ui'
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

  background-color: ${({ theme }) => theme.backgroundTransparent};

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
  max-height: 600px;

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
        <FadeIn duration={250}>
          <ModalContent
            ref={modalRef}
            height={props.height}
            width={props.width}
          >
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
        </FadeIn>
      </ModalWrapperStyled>
    </Portal>
  )
}
