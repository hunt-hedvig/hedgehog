import { isPressing, Key, Keys, useKeyIsPressed } from '@hedvig-ui'
import { CommandLineModal } from 'portals/hope/features/commands/components/CommandLineModal'
import { PushShortcutUsed } from 'portals/hope/features/tracking/utils/tags'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

export interface CommandLineAction {
  label: string
  keys?: Key[]
  onResolve: () => void
}

interface CommandLineContextProps {
  registerActions: (newActions: CommandLineAction[]) => void
  isHintingOption: boolean
  isHintingControl: boolean
}

const CommandLineContext = createContext<CommandLineContextProps>({
  registerActions: () => void 0,
  isHintingOption: false,
  isHintingControl: false,
})

export const useCommandLine = () => useContext(CommandLineContext)

export const CommandLineProvider: React.FC = ({ children }) => {
  const commandLine = useRef<HTMLInputElement>(null)
  const [showCommandLine, setShowCommandLine] = useState(false)
  const actions = useRef<CommandLineAction[]>([])
  const actionKeyCodes = useRef<string[][]>([])

  const isControlPressed = useKeyIsPressed(Keys.Control)
  const isOptionPressed = useKeyIsPressed(Keys.Option)

  const onKeyDownShowCommandLine = (e: KeyboardEvent) => {
    if (!isPressing(e, Keys.Space)) {
      return
    }
    if (e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
      setShowCommandLine(true)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDownShowCommandLine)

    return () => {
      document.removeEventListener('keydown', onKeyDownShowCommandLine)
    }
  }, [])

  useKeyIsPressed(Keys.Escape, () => {
    setShowCommandLine(false)
  })

  const onMouseDown = (event: MouseEvent) => {
    if (
      commandLine.current &&
      event.target instanceof Node &&
      commandLine.current.contains(event.target)
    ) {
      return
    }
    setShowCommandLine(false)
  }

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  const addAction = (newActions: CommandLineAction[]) => {
    useEffect(() => {
      actions.current = [...newActions, ...actions.current]
      updateActionKeyCodes()
      return () => {
        newActions.forEach((newAction) => {
          removeAction(newAction.label)
        })
        updateActionKeyCodes()
      }
    }, [])
  }

  const removeAction = (label: string) => {
    actions.current = actions.current.filter((action) => action.label !== label)
  }

  const updateActionKeyCodes = () => {
    actionKeyCodes.current = actions.current.map(
      (action) => (action.keys && action.keys.map((key) => key.code)) || [],
    )
  }

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState(e.key)) {
      return
    }

    if (!(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) {
      return
    }

    const matchIndex = actionKeyCodes.current.findIndex((keyCodes) => {
      return isPressing(e, keyCodes)
    })

    if (matchIndex > -1) {
      PushShortcutUsed(
        actions.current[matchIndex].label,
        actions.current[matchIndex].keys?.map((key) => key.code) ?? [],
      )

      actions.current[matchIndex].onResolve()
      setShowCommandLine(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, {
      capture: true,
    })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <CommandLineContext.Provider
      value={{
        registerActions: addAction,
        isHintingOption: isOptionPressed,
        isHintingControl: isControlPressed,
      }}
    >
      {children}
      {showCommandLine && (
        <div ref={commandLine}>
          <CommandLineModal
            hide={() => setShowCommandLine(false)}
            actions={actions.current}
          />
        </div>
      )}
    </CommandLineContext.Provider>
  )
}
