import styled from '@emotion/styled'
import { FadeIn, FourthLevelHeadline, Input, Paragraph } from '@hedvig-ui'
import {
  isPressing,
  Key,
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useMe } from 'features/user/hooks/use-me'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'react-hot-toast'
import {
  User,
  useSharePathMutation,
  useUsersQuery,
} from 'types/generated/graphql'

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
  padding: 1em 1em 1em 3.5em;
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
    border: none;
    padding-top: 1em;
    padding-bottom: 1em;
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
        {action.keys &&
          action.keys.map(({ hint }) => (
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
  keys?: Key[]
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

  const {
    me: { email: myEmail },
  } = useMe()
  const { data } = useUsersQuery()
  const [sharePath] = useSharePathMutation()

  const handleShare = (user: Omit<User, 'notifications' | 'signature'>) => {
    toast.promise(
      sharePath({ variables: { path: location.pathname, userId: user.id } }),
      {
        loading: 'Sharing page',
        success: `Page shared with ${user.fullName.split(' ')[0]}`,
        error: 'Could not share page',
      },
    )
  }

  const advancedActions: CommandLineAction[] = [
    {
      label: 'Share path',
      onResolve: () => setSearchValue('/share @'),
    },
  ]

  const setUsersAsResult = () => {
    const name = searchValue.split('@')[searchValue.split('@').length - 1]
    const users =
      data?.users?.filter(
        (user) =>
          user.email !== myEmail &&
          user.fullName.toLowerCase().includes(name.toLowerCase()),
      ) ?? []

    setSearchResult(
      users?.map((user) => ({
        label: user.fullName,
        onResolve: () => {
          handleShare(user)
          setSearchValue(`/share @${user.fullName}`)
        },
      })) || [],
    )
  }

  useEffect(() => {
    if (searchValue === '/') {
      setSearchResult(advancedActions)
    } else if (searchValue.includes('/share') && searchValue.includes('@')) {
      setUsersAsResult()
    } else {
      setSearchResult(
        actions.filter((item) => {
          return item.label.toLowerCase().includes(searchValue.toLowerCase())
        }),
      )
    }
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
    if (!searchValue.includes('/')) {
      hide()
    }
    searchResult[selectedActionIndex].onResolve()
  }, [isEnterPressed])

  return (
    <CommandLineWindow>
      <SearchWrapper>
        <CommandLineInput
          autoFocus
          value={searchValue}
          size="large"
          onKeyDown={(e) => {
            if (isPressing(e, Keys.Down) || isPressing(e, Keys.Up)) {
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
          placeholder="What can I help you with?"
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

  // tslint:disable:no-unused-expression
  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.getModifierState(e.key)) {
      return
    }
    if (!(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) {
      return
    }

    const matchIndex = actionKeyCodes.current.findIndex((keyCodes) => {
      return isPressing(e, keyCodes)
    })

    if (matchIndex > -1) {
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
        <CommandLineWrapper ref={commandLine}>
          <CommandLineComponent
            hide={() => setShowCommandLine(false)}
            actions={actions.current}
          />
        </CommandLineWrapper>
      )}
    </CommandLineContext.Provider>
  )
}
