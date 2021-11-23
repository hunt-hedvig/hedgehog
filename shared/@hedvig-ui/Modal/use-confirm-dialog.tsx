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

const Content = styled.h3`
  word-wrap: break-word;
`

const ConfirmButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;
`

const Button = styled(DefaultButton)`
  font-size: 14px;
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
      width="500px"
      position="top"
      side="center"
      onClose={close}
    >
      <div>
        <Content>
          {content}a
          dshfkjadfhkljadhflkjhadflkjahdfhkadfhlksadhlkjadhflkhsadfkhasdfhlsadhflksadfhlksadfh
        </Content>
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
    </Modal>
  )
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
