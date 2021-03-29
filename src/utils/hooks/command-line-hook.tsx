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
  KeyCode,
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

const ResultItem: React.FC<{
  label: string
  characters: string[]
  selected?: boolean
}> = ({ label, characters, selected = false }) => {
  return (
    <ResultItemWrapper selected={selected}>
      <FourthLevelHeadline>{label}</FourthLevelHeadline>
      <ResultItemContent>
        {characters.map((character) => (
          <CharacterBadge key={character}>
            <Paragraph style={{ fontSize: '0.8em', fontWeight: 'bold' }}>
              {character}
            </Paragraph>
          </CharacterBadge>
        ))}
      </ResultItemContent>
    </ResultItemWrapper>
  )
}

export interface CommandLineAction {
  label: string
  keysHint: string[]
  keys: number[]
  onResolve: () => void
}

export const CommandLineComponent: React.FC<{
  hide: () => void
  actions: CommandLineAction[]
}> = ({ hide, actions }) => {
  const [value, setValue] = useState('')
  const [selectedItem, setSelectedItem] = useState(0)

  const isUpPressed = useKeyIsPressed(KeyCode.Up)
  const isDownPressed = useKeyIsPressed(KeyCode.Down)
  const isEnterPressed = useKeyIsPressed(KeyCode.Return)

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
    setSelectedItem(0)
  }, [])

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
      <div
        style={{
          width: '100%',
        }}
      >
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
      </div>
      <div>
        {getSearchResult(value).map(({ label, keysHint }, index) => (
          <FadeIn delay={`${index * 50}ms`} key={label + index.toString()}>
            <ResultItem
              label={label}
              characters={keysHint}
              selected={index === selectedItem}
            />
          </FadeIn>
        ))}
      </div>
    </CommandLineWindow>
  )
}

interface CommandLineContextProps {
  registerActions: (newActions: CommandLineAction[]) => any
  setBlocked: (value: boolean) => void
  isHinting: boolean
}

const CommandLineContext = createContext<CommandLineContextProps>({
  registerActions: (_: CommandLineAction[]) => void 0,
  setBlocked: (_: boolean) => void 0,
  isHinting: false,
})

export const useCommandLine = () => useContext(CommandLineContext)

export const CommandLineProvider: React.FC = ({ children }) => {
  const [showCommandLine, setShowCommandLine] = useState(false)
  const [actions, setActions] = useState<CommandLineAction[]>([])
  const [blocked, setBlocked] = useState(false)
  const actionsRef = useRef<CommandLineAction[]>()

  const isOptionPressed = useKeyIsPressed(KeyCode.Control)
  const isSpacePressed = useKeyIsPressed(KeyCode.Space)
  const isEscapePressed = useKeyIsPressed(KeyCode.Escape)

  const keys = usePressedKeys(blocked)

  useEffect(() => {
    actionsRef.current = actions
  }, [actions])

  const onMousePress = () => {
    setShowCommandLine(false)
  }

  useEffect(() => {
    if (blocked) {
      return
    }
    for (const action of actions) {
      const match =
        action.keys.filter((key) => !keys.includes(key)).length === 0

      if (match) {
        action.onResolve()
        break
      }
    }
  }, [keys])

  useEffect(() => {
    window.addEventListener('mousedown', onMousePress)

    return () => {
      window.removeEventListener('mousedown', onMousePress)
    }
  }, [])

  useEffect(() => {
    if (blocked) {
      return
    }
    if (isOptionPressed && isSpacePressed) {
      setShowCommandLine(true)
    }
  }, [isOptionPressed, isSpacePressed])

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
        setBlocked: (value: boolean) => setBlocked(value),
        isHinting: blocked ? false : isOptionPressed,
      }}
    >
      {children}
      {!blocked && showCommandLine && (
        <CommandLineComponent
          hide={() => setShowCommandLine(false)}
          actions={actions}
        />
      )}
    </CommandLineContext.Provider>
  )
}
