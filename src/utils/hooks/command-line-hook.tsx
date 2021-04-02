import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { Input } from 'hedvig-ui/input'
import { FourthLevelHeadline, Paragraph } from 'hedvig-ui/typography'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from 'react-emotion'
import { Icon } from 'semantic-ui-react'
import {
  Key,
  Keys,
  useKeyIsPressed,
  usePressedKeys,
} from 'utils/hooks/key-press-hook'

const CommandLineWindow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 1);
  box-shadow: -1px -1px 42px 0px rgba(0, 0, 0, 0.25);
  border-radius: 0.3em;
`

const CharacterBadge = styled.div`
  background: rgba(0, 0, 0, 0.1);
  padding: 0.35em 0.55em;
  border-radius: 0.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.4em;
`

const ResultItemWrapper = styled.div<{ selected: boolean }>`
  padding: 1em 3.5em;
  padding-right: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ selected }) =>
    selected ? 'rgba(0, 0, 0, 0.1)' : 'transparent'};
`

const ResultItemContent = styled.div`
  display: flex;
  flex-direction: row;
`

const CommandLineInput = styled(Input)`
  &&&& {
    width: 40vw;
    min-width: 500px;
    padding: 1em 1em;
  }
`

const SearchWrapper = styled.div`
  width: 100%;
`

const SearchResultWrapper = styled.div``

const ResultItem: React.FC<{
  label: string
  keys: Key[]
  selected?: boolean
}> = ({ label, keys, selected = false }) => {
  return (
    <ResultItemWrapper selected={selected}>
      <FourthLevelHeadline>{label}</FourthLevelHeadline>
      <ResultItemContent>
        {keys.map(({ hint }) => (
          <CharacterBadge key={hint}>
            <Paragraph style={{ fontSize: '0.8em', fontWeight: 'bold' }}>
              {hint}
            </Paragraph>
          </CharacterBadge>
        ))}
      </ResultItemContent>
    </ResultItemWrapper>
  )
}

export interface CommandLineAction {
  label: string
  keys: Key[]
  onResolve: () => void
}

export const CommandLineComponent: React.FC<{
  hide: () => void
  actions: CommandLineAction[]
}> = ({ hide, actions }) => {
  const [value, setValue] = useState('')
  const [selectedItem, setSelectedItem] = useState(0)

  const isUpPressed = useKeyIsPressed(Keys.Up)
  const isDownPressed = useKeyIsPressed(Keys.Down)
  const isEnterPressed = useKeyIsPressed(Keys.Return)

  useEffect(() => {
    if (isUpPressed && selectedItem > 0) {
      setSelectedItem(selectedItem - 1)
    }

    if (isDownPressed && selectedItem < 2) {
      setSelectedItem(selectedItem + 1)
    }
  }, [isUpPressed, isDownPressed])

  const getSearchResult = (query: string) => {
    if (value === '') {
      return []
    }

    return actions
      .filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
      .slice(0, 3)
  }

  useEffect(() => {
    if (isEnterPressed) {
      hide()
      if (getSearchResult(value).length !== 0) {
        getSearchResult(value)[selectedItem].onResolve()
      }
    }
  }, [isEnterPressed])

  return (
    <CommandLineWindow>
      <SearchWrapper>
        <CommandLineInput
          autoFocus
          value={value}
          onChange={({ target }) => {
            const inputValue = (target as HTMLInputElement).value
            const NON_BREAKING_SPACE = '\xa0'

            if (inputValue === NON_BREAKING_SPACE || inputValue === ' ') {
              return
            }

            setValue(inputValue)
          }}
          icon={<Icon name="search" style={{ marginLeft: '1em' }} />}
          iconPosition="left"
          placeholder="What can I help you with?"
          transparent
          size={'large'}
        />
      </SearchWrapper>
      <SearchResultWrapper>
        {getSearchResult(value).map(({ label, keys }, index) => (
          <FadeIn delay={`${index * 50}ms`} key={label + index.toString()}>
            <ResultItem
              label={label}
              keys={keys}
              selected={index === selectedItem}
            />
          </FadeIn>
        ))}
      </SearchResultWrapper>
    </CommandLineWindow>
  )
}

interface CommandLineContextProps {
  registerActions: (newActions: CommandLineAction[]) => any
  isInputBlocked: (keyCode: number) => boolean
  setBlocked: (value: boolean) => void
  isHinting: boolean
}

const CommandLineContext = createContext<CommandLineContextProps>({
  registerActions: (_: CommandLineAction[]) => void 0,
  isInputBlocked: (_: number) => false,
  setBlocked: (_: boolean) => void 0,
  isHinting: false,
})

const CommandLineWrapper = styled.div``

export const useCommandLine = () => useContext(CommandLineContext)

export const CommandLineProvider: React.FC = ({ children }) => {
  const commandLineRef = useRef<HTMLInputElement>(null)
  const [showCommandLine, setShowCommandLine] = useState(false)
  const [actions, setActions] = useState<CommandLineAction[]>([])
  const [blocked, setBlocked] = useState(false)
  const actionsRef = useRef<CommandLineAction[]>()

  const isOptionPressed = useKeyIsPressed(Keys.Option)
  const isSpacePressed = useKeyIsPressed(Keys.Space)
  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  const keys = usePressedKeys(blocked)

  const isPressingActionKeys = (pressedKeys, actionKeys) =>
    actionKeys.length === pressedKeys.length &&
    actionKeys.filter((key) => !pressedKeys.includes(key.code)).length === 0

  useEffect(() => {
    actionsRef.current = actions
  }, [actions])

  const onMouseDown = (event) => {
    if (
      commandLineRef.current &&
      commandLineRef.current.contains(event.target)
    ) {
      return
    }
    setShowCommandLine(false)
  }

  useEffect(() => {
    if (blocked) {
      return
    }
    for (const action of actions) {
      const match = isPressingActionKeys(keys, action.keys)

      if (match) {
        action.onResolve()
        setShowCommandLine(false)
        break
      }
    }
  }, [keys])

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown)

    return () => {
      window.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  useEffect(() => {
    if (showCommandLine) {
      return
    }
    if (blocked) {
      return
    }
    if (isOptionPressed && isSpacePressed) {
      setShowCommandLine(true)
    }
  }, [keys])

  useEffect(() => {
    setShowCommandLine(false)
  }, [isEscapePressed])

  const addAction = (newActions: CommandLineAction[]) => {
    useEffect(() => {
      setActions([...(actionsRef.current ?? []), ...newActions])
      return () => {
        newActions.forEach((newAction) => {
          removeAction(newAction.label)
        })
      }
    }, [])
  }

  const removeAction = (label: string) => {
    actionsRef.current = (actionsRef.current ?? []).filter(
      (action) => action.label !== label,
    )
  }

  return (
    <CommandLineContext.Provider
      value={{
        registerActions: addAction,
        isInputBlocked: (keyCode) => {
          if (!isOptionPressed) {
            return false
          }
          if (Keys.One.code <= keyCode && keyCode <= Keys.Nine.code) {
            return false
          }
          if (Keys.Left.code === keyCode || Keys.Right.code === keyCode) {
            return false
          }
          return true
        },
        setBlocked: (value: boolean) => setBlocked(value),
        isHinting: blocked ? false : isOptionPressed,
      }}
    >
      {children}
      {!blocked && showCommandLine && (
        <CommandLineWrapper innerRef={commandLineRef}>
          <CommandLineComponent
            hide={() => setShowCommandLine(false)}
            actions={actions}
          />
        </CommandLineWrapper>
      )}
    </CommandLineContext.Provider>
  )
}
