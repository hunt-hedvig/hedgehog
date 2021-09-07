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

export const ModalWrapperStyled = styled.div<{
  position?: 'top' | 'center' | 'bottom'
  side?: 'left' | 'center' | 'right'
}>(({ position, side, theme }) => ({
  width: '100vw',
  height: '100vh',
  padding: '50px',
  backgroundColor: theme.backgroundTransparent,
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems:
    position === 'top'
      ? 'flex-start'
      : position === 'bottom'
      ? 'flex-end'
      : 'center',
  justifyContent:
    side === 'left' ? 'flex-start' : side === 'right' ? 'flex-end' : 'center',
}))

export const ModalContent = styled.div<{
  width?: string
  height?: string
}>(({ width, height, theme }) => ({
  width: width || '350px',
  maxWidth: '900px',
  height: height || '150px',
  maxHeight: '600px',
  borderRadius: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.background,
  boxShadow: `0 5px 40px ${theme.backgroundTransparent}`,
}))

export const ModalHeader = styled.div(({ theme }) => ({
  padding: '10px 15px',
  display: 'grid',
  gridTemplateColumns: '1fr 20px',
  columnGap: '10px',
  alignItems: 'center',
  boxSizing: 'content-box',
  borderBottom: `1px solid ${theme.border}`,
  '.modal-title': {
    color: theme.foreground,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '.modal-close': {
    color: theme.foreground,
    width: 20,
    height: 20,
    cursor: 'pointer',
  },
}))

export const ModalBody = styled.div(({ theme }) => {
  return {
    flex: 1,
    padding: 15,
    color: theme.foreground,
  }
})
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
