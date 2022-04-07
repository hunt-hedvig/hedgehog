import React, { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Keys, useKeyIsPressed } from '@hedvig-ui'
import { ActionsHistoryModal } from './components/ActionsHistoryModal'
import { v4 as uuidv4 } from 'uuid'

type actionArgs = {
  action: () => void
  undoAction: () => void
  title: string
}
interface ActionsHistoryContextProps {
  registerAction: (args: actionArgs) => void
  showHistory: () => void
}

const ActionsHistoryContext = createContext<ActionsHistoryContextProps>({
  registerAction: () => void 0,
  showHistory: () => void 0,
})

export const useActionsHistory = () => useContext(ActionsHistoryContext)

export interface Action {
  id: string
  action: () => void
  undoAction: () => void
  title: string
  date: Date
}

export const ActionsHistoryProvider: React.FC = ({ children }) => {
  const [showHistory, setShowHistory] = useState(false)
  const [actionsList, setActionsList] = useState<Array<Action>>([])
  const [waitUndo, setWaitUndo] = useState(false)

  const isCommandPressed = useKeyIsPressed(Keys.Command)
  const isZPressed = useKeyIsPressed(Keys.Z)

  useEffect(() => {
    let timeoutID: ReturnType<typeof setTimeout>

    if (waitUndo) {
      toast.loading('You have 5 sec to undo (cmd + Z)', {
        duration: 5000,
      })

      timeoutID = setTimeout(() => {
        setWaitUndo(false)
        actionsList[actionsList.length - 1].action()
      }, 3000)
    } else {
      toast.remove()
    }

    return () => clearTimeout(timeoutID)
  }, [waitUndo])

  useEffect(() => {
    if (isCommandPressed && isZPressed && waitUndo) {
      const lastAction = actionsList[actionsList.length - 1]
      lastAction.undoAction()
      setWaitUndo(false)
    }
  }, [isCommandPressed, isZPressed])

  const registerActionHandler = ({ title, action, undoAction }: actionArgs) => {
    const newAction = {
      id: uuidv4(),
      title,
      action,
      undoAction,
      date: new Date(),
    }

    setActionsList((prev) => [...prev, newAction])

    setWaitUndo(true)
  }

  const deleteActionHandler = (id: string) => {
    setActionsList((prev) => prev.filter((action) => action.id !== id))
  }

  return (
    <ActionsHistoryContext.Provider
      value={{
        registerAction: registerActionHandler,
        showHistory: () => setShowHistory(true),
      }}
    >
      {children}
      {showHistory && (
        <ActionsHistoryModal
          hide={() => setShowHistory(false)}
          actionsList={actionsList}
          deleteAction={deleteActionHandler}
        />
      )}
    </ActionsHistoryContext.Provider>
  )
}
