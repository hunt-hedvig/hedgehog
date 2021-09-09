import styled from '@emotion/styled'
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
import { Icon } from 'semantic-ui-react'
import { Key, Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'

const CommandLineWindow = styled.div`
  position: absolute;
  top: 20vh;
  left: 50%;
  transform: translateX(-50%);
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

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
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
  action: CommandLineAction
  selected?: boolean
  hide: () => void
}> = ({ action, selected = false, hide }) => {
  return (
    <ResultItemWrapper
      selected={selected}
      onClick={() => {
        action.onResolve()
        hide()
      }}
    >
      <FourthLevelHeadline>{action.label}</FourthLevelHeadline>
      <ResultItemContent>
        {action.keys.map(({ hint }) => (
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
  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState<CommandLineAction[]>([])

  const isUpPressed = useKeyIsPressed(Keys.Up)
  const isDownPressed = useKeyIsPressed(Keys.Down)
  const isEnterPressed = useKeyIsPressed(Keys.Enter)

  const maxActions = 10
  const [selectedActionIndex, setSelectedActionIndex] = useState(0)
  const [firstActionIndex, setFirstActionIndex] = useState(0)

  useEffect(() => {
    setSearchResult(
      actions.filter((item) => {
        return item.label.toLowerCase().includes(searchValue.toLowerCase())
      }),
    )
    setFirstActionIndex(0)
    setSelectedActionIndex(0)
  }, [searchValue])

  useEffect(() => {
    if (!isUpPressed) {
      return
    }
    if (searchResult.length === 0) {
      return
    }
    if (selectedActionIndex > 0) {
      setSelectedActionIndex(selectedActionIndex - 1)
    } else {
      setSelectedActionIndex(searchResult.length - 1)
    }
    if (selectedActionIndex === 0) {
      setFirstActionIndex(Math.max(searchResult.length - maxActions, 0))
    } else if (selectedActionIndex === firstActionIndex) {
      setFirstActionIndex(Math.max(firstActionIndex - 1, 0))
    }
  }, [isUpPressed])

  useEffect(() => {
    if (!isDownPressed) {
      return
    }
    if (searchResult.length === 0) {
      return
    }
    if (selectedActionIndex === searchResult.length - 1) {
      setSelectedActionIndex(0)
    } else {
      setSelectedActionIndex(selectedActionIndex + 1)
    }
    if (selectedActionIndex === searchResult.length - 1) {
      setFirstActionIndex(0)
    } else if (selectedActionIndex === firstActionIndex + maxActions - 1) {
      setFirstActionIndex(firstActionIndex + 1)
    }
  }, [isDownPressed])

  useEffect(() => {
    if (!isEnterPressed) {
      return
    }
    if (searchResult.length === 0) {
      return
    }
    hide()
    searchResult[selectedActionIndex].onResolve()
  }, [isEnterPressed])

  return (
    <CommandLineWindow>
      <SearchWrapper>
        <CommandLineInput
          autoFocus
          value={searchValue}
          onKeyDown={(e) => {
            if (e.keyCode === Keys.Down.code || e.keyCode === Keys.Up.code) {
              e.preventDefault()
            }
          }}
          onChange={({ target }) => {
            const inputValue = (target as HTMLInputElement).value
            const NON_BREAKING_SPACE = '\xa0'

            if (inputValue === NON_BREAKING_SPACE || inputValue === ' ') {
              return
            }

            setSearchValue(inputValue)
          }}
          icon={<Icon name="search" style={{ marginLeft: '1em' }} />}
          iconPosition="left"
          placeholder="What can I help you with?"
          transparent
          size={'large'}
        />
      </SearchWrapper>
      <SearchResultWrapper>
        {searchResult
          .slice(firstActionIndex, firstActionIndex + maxActions)
          .map((action, index) => (
            <FadeIn
              delay={`${Math.abs(
                selectedActionIndex - firstActionIndex - index,
              ) * 40}ms`}
              duration={400}
              key={`${action.label} ${searchValue}`}
            >
              <ResultItem
                hide={hide}
                action={action}
                selected={firstActionIndex + index === selectedActionIndex}
              />
            </FadeIn>
          ))}
      </SearchResultWrapper>
    </CommandLineWindow>
  )
}

interface CommandLineContextProps {
  registerActions: (newActions: CommandLineAction[]) => any
  isHintingOption: boolean
  isHintingControl: boolean
}

const CommandLineContext = createContext<CommandLineContextProps>({
  registerActions: (_: CommandLineAction[]) => void 0,
  isHintingOption: false,
  isHintingControl: false,
})

const CommandLineWrapper = styled.div``

export const useCommandLine = () => useContext(CommandLineContext)

export const CommandLineProvider: React.FC = ({ children }) => {
  const commandLine = useRef<HTMLInputElement>(null)
  const [showCommandLine, setShowCommandLine] = useState(false)
  const actions = useRef<CommandLineAction[]>([])

  const isOptionPressed = useKeyIsPressed(Keys.Option)
  const isControlPressed = useKeyIsPressed(Keys.Control)
  const isSpacePressed = useKeyIsPressed(Keys.Space)
  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  const onMouseDown = (event) => {
    if (commandLine.current && commandLine.current.contains(event.target)) {
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

  useEffect(() => {
    if (showCommandLine) {
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
        isHintingOption: isOptionPressed,
        isHintingControl: isControlPressed,
      }}
    >
      <CommandSpace
        actions={actions.current}
        hide={() => setShowCommandLine(false)}
      >
        {children}
        {showCommandLine && (
          <CommandLineWrapper ref={commandLine}>
            <CommandLineComponent
              hide={() => setShowCommandLine(false)}
              actions={actions.current}
            />
          </CommandLineWrapper>
        )}
      </CommandSpace>
    </CommandLineContext.Provider>
  )
}

const CommandSpace: React.FC<{
  actions: CommandLineAction[]
  hide: () => void
}> = ({ actions, hide, children }) => {
  const [actionKeyCodes, setActionKeyCodes] = useState<number[][]>([])
  useEffect(() => {
    setActionKeyCodes(
      actions.map((action) => action.keys.map((key) => key.code)),
    )
  }, [actions])

  // tslint:disable:no-unused-expression
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const modifiers: number[] = []
    e.shiftKey && modifiers.push(Keys.Shift.code)
    e.ctrlKey && modifiers.push(Keys.Control.code)
    e.altKey && modifiers.push(Keys.Option.code)
    e.metaKey && modifiers.push(Keys.Command.code)
    if (modifiers.includes(e.keyCode) || modifiers.length === 0) {
      return
    }
    const keys = modifiers.concat(e.keyCode)

    const matchIndex = actionKeyCodes.findIndex((keyCodes) => {
      return keyCodes.every((keyCode, index) => keyCode === keys[index])
    })

    if (matchIndex > -1) {
      actions[matchIndex].onResolve()
      hide()
    }
  }

  return (
    <div tabIndex={-1} onKeyDown={handleKeyDown}>
      {children}
    </div>
  )
}
