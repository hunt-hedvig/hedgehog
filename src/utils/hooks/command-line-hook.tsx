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

  const maxActions = 10

  useEffect(() => {
    if (isUpPressed) {
      if (selectedItem > 0) {
        setSelectedItem(selectedItem - 1)
      } else {
        setSelectedItem(maxActions - 1)
      }
    }

    if (isDownPressed) {
      if (selectedItem < maxActions - 1) {
        setSelectedItem(selectedItem + 1)
      } else {
        setSelectedItem(0)
      }
    }
  }, [isUpPressed, isDownPressed])

  const getSearchResult = (query: string) =>
    actions
      .filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
      .slice(0, maxActions)

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
  isHinting: boolean
}

const CommandLineContext = createContext<CommandLineContextProps>({
  registerActions: (_: CommandLineAction[]) => void 0,
  isHinting: false,
})

const CommandLineWrapper = styled.div``

export const useCommandLine = () => useContext(CommandLineContext)

export const CommandLineProvider: React.FC = ({ children }) => {
  const commandLine = useRef<HTMLInputElement>(null)
  const [showCommandLine, setShowCommandLine] = useState(false)
  const actions = useRef<CommandLineAction[]>([])
  const [actionKeyCodes, setActionKeyCodes] = useState<number[][]>([])

  const isOptionPressed = useKeyIsPressed(Keys.Option)
  const isSpacePressed = useKeyIsPressed(Keys.Space)
  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  const keys = usePressedKeys()

  const onMouseDown = (event) => {
    if (commandLine.current && commandLine.current.contains(event.target)) {
      return
    }
    setShowCommandLine(false)
  }

  useEffect(() => {
    setActionKeyCodes(
      actions.current.map((action) => action.keys.map((key) => key.code)),
    )
  }, [actions.current])

  useEffect(() => {
    const matchIndex = actionKeyCodes.findIndex((keyCodes) => {
      return keyCodes.every((keyCode, index) => keyCode === keys[index])
    })

    if (matchIndex > -1) {
      actions.current[matchIndex].onResolve()
      setShowCommandLine(false)
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
    if (isOptionPressed && isSpacePressed) {
      setShowCommandLine(true)
    }
  }, [keys])

  useEffect(() => {
    setShowCommandLine(false)
  }, [isEscapePressed])

  const addAction = (newActions: CommandLineAction[]) => {
    useEffect(() => {
      actions.current = [...newActions, ...actions.current]
      return () => {
        newActions.forEach((newAction) => {
          removeAction(newAction.label)
        })
      }
    }, [])
  }

  const removeAction = (label: string) => {
    actions.current = actions.current.filter((action) => action.label !== label)
  }

  return (
    <CommandLineContext.Provider
      value={{
        registerActions: addAction,
        isHinting: isOptionPressed, // TODO: Use hinting from different modifiers
      }}
    >
      {children}
      {showCommandLine && (
        <CommandLineWrapper innerRef={commandLine}>
          <CommandLineComponent
            hide={() => setShowCommandLine(false)}
            actions={actions.current}
          />
        </CommandLineWrapper>
      )}
    </CommandLineContext.Provider>
  )
}
