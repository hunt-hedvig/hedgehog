import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FadeIn } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useClickOutside } from '@hedvig-ui/hooks/use-click-outside'
import {
  FocusItems,
  useNavigation,
} from 'portals/hope/features/navigation/hooks/use-navigation'
import React, { useEffect, useRef } from 'react'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { Portal } from 'react-portal'

const ModalWrapperStyled = styled.div<{
  position?: 'top' | 'center' | 'bottom'
  side?: 'left' | 'center' | 'right'
  padding?: string
  dim: boolean
}>`
  width: 100vw;
  height: 100vh;

  ${({ dim }) =>
    dim &&
    css`
      background-color: rgba(0, 0, 0, 0.4);
    `};

  position: fixed;
  top: 0;
  left: 0;
  z-index: 1002;

  display: flex;
  align-items: ${({ position }) =>
    position === 'top'
      ? 'flex-start'
      : position === 'bottom'
      ? 'flex-end'
      : 'center'};
  justify-content: ${({ side }) =>
    side === 'left' ? 'flex-start' : side === 'right' ? 'flex-end' : 'center'};
  padding: ${({ padding }) => padding ?? ' 50px'};
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
  padding?: string
}

export const Modal: React.FC<ModalProps> = ({
  disableClickOutside,
  onClose,
  position,
  side,
  dimBackground,
  padding,
  height,
  width,
  style,
  title,
  withoutHeader,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  const { setFocus } = useNavigation()

  useEffect(() => {
    setFocus(FocusItems.Main.items.Modal)

    return () => setFocus(null)
  }, [])

  const clickOutsideCloseHandler = () => {
    setFocus(null)

    if (!disableClickOutside) {
      return onClose()
    } else {
      return
    }
  }

  useClickOutside(modalRef, clickOutsideCloseHandler)
  useKeyIsPressed(Keys.Escape, () => onClose())

  return (
    <Portal>
      <ModalWrapperStyled
        position={position}
        side={side}
        dim={dimBackground ?? true}
        padding={padding}
      >
        <FadeIn duration={250}>
          <ModalContent
            className="modal"
            ref={modalRef}
            height={height}
            width={width}
            style={style}
          >
            {!withoutHeader && (
              <ModalHeader className="modal__header">
                <span className="modal-title" title={title}>
                  {title}
                </span>
                <CloseIcon className="modal-close" onClick={onClose} />
              </ModalHeader>
            )}
            <ModalBody className="modal__body">{children}</ModalBody>
          </ModalContent>
        </FadeIn>
      </ModalWrapperStyled>
    </Portal>
  )
}
