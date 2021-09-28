import styled from '@emotion/styled'
import { Button, Modal } from '@hedvig-ui'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Key, Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'

const ConfirmButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;
`

export const ConfirmDialogComponent: React.FC<{
  content: string
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
    <Modal
      withoutHeader={true}
      disableClickOutside={true}
      height="auto"
      width="400px"
      position="top"
      side="center"
      onClose={close}
    >
      <div>
        <h3>{content}</h3>
        <ConfirmButtons>
          <Button
            autoFocus={true}
            fullWidth
            variation="success"
            onClick={confirm}
          >
            Confirm
          </Button>
          <Button fullWidth variation="secondary" onClick={close}>
            Cancel
          </Button>
        </ConfirmButtons>
      </div>
    </Modal>
  )
}

export interface ConfirmDialogAction {
  label: string
  keys: Key[]
  onConfirm: () => void
}

export interface ConfirmDialogContextProps {
  confirm: any
}

const ConfirmDialogContext = createContext<ConfirmDialogContextProps>({
  confirm: undefined,
})

export const useConfirmDialog = () => useContext(ConfirmDialogContext)

export const ConfirmDialogProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const awaitingPromiseRef = useRef<{
    resolve: (value: boolean) => void
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
      awaitingPromiseRef.current.resolve(true)
    }
  }

  const confirm = (msg: string) => {
    setMessage(msg)
    setShowConfirmDialog(true)

    return new Promise((resolve, reject) => {
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