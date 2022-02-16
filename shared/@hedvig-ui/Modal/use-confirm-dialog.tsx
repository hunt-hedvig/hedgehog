import styled from '@emotion/styled'
import { Button as DefaultButton, Modal } from '@hedvig-ui'
import {
  isPressing,
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

const StyledModal = styled(Modal)`
  width: 400px;
  padding: 1rem;
`

const ConfirmButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;
`

const Button = styled(DefaultButton)`
  font-size: 0.875rem;
`

export const ConfirmDialogComponent: React.FC<{
  content: React.ReactNode
  close: () => void
  confirm: () => void
}> = ({ content, close, confirm }) => {
  const isEnterPressed = useKeyIsPressed(Keys.Enter)
  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  useEffect(() => {
    if (isEnterPressed) {
      confirm()
    }
  }, [isEnterPressed])

  useEffect(() => {
    if (isEscapePressed) {
      close()
    }
  }, [isEscapePressed])

  return (
    <StyledModal
      options={{
        disableClickOutside: true,
        position: 'top',
      }}
      onClose={close}
    >
      <div>
        <h3 style={{ wordBreak: 'break-word' }}>{content}</h3>
        <ConfirmButtons>
          <Button size="small" status="success" onClick={confirm} autoFocus>
            Confirm
          </Button>
          <Button
            size="small"
            variant="tertiary"
            onClick={close}
            onKeyDown={(e) => {
              if (isPressing(e, Keys.Enter)) {
                e.preventDefault()
                close()
              }
            }}
          >
            Cancel
          </Button>
        </ConfirmButtons>
      </div>
    </StyledModal>
  )
}

export interface ConfirmDialogContextProps {
  confirm: (content: React.ReactNode) => Promise<void>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextProps>({
  confirm: () => Promise.resolve(),
})

export const useConfirmDialog = () => useContext(ConfirmDialogContext)

export const ConfirmDialogProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState<React.ReactNode>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const awaitingPromiseRef = useRef<{
    resolve: () => void
    reject: () => void
  }>()

  const closeHandler = () => {
    if (awaitingPromiseRef.current) {
      setShowConfirmDialog(false)
      awaitingPromiseRef.current.reject()
    }
  }

  const confirmHandler = () => {
    if (awaitingPromiseRef.current) {
      setShowConfirmDialog(false)
      awaitingPromiseRef.current.resolve()
    }
  }

  const confirm = (m: React.ReactNode) => {
    setMessage(m)
    setShowConfirmDialog(true)

    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject }
    })
  }

  return (
    <ConfirmDialogContext.Provider
      value={{
        confirm,
      }}
    >
      {children}
      {showConfirmDialog && (
        <ConfirmDialogComponent
          content={message}
          close={closeHandler}
          confirm={confirmHandler}
        />
      )}
    </ConfirmDialogContext.Provider>
  )
}
