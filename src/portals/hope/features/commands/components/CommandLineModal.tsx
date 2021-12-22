import styled from '@emotion/styled'
import { FadeIn, FourthLevelHeadline, Input, Paragraph } from '@hedvig-ui'
import {
  isPressing,
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useAdvancedActions } from 'portals/hope/features/commands/hooks/use-advanced-actions'
import { CommandLineAction } from 'portals/hope/features/commands/use-command-line'
import React, { useEffect, useState } from 'react'

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

const Wrapper = styled.div`
  position: absolute;
  top: 20vh;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 1);
  box-shadow: -1px -1px 42px 0px rgba(0, 0, 0, 0.25);
  border-radius: 0.3em;
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

export const CommandLineModal: React.FC<{
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

  useAdvancedActions(
    searchValue,
    (value) => setSearchValue(value),
    (value) => setSearchResult(value),
    () => hide(),
  )

  useEffect(() => {
    if (searchValue[0] !== '/') {
      setSearchResult(
        actions.filter((item) =>
          item.label.toLowerCase().includes(searchValue.toLowerCase()),
        ),
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
    <Wrapper>
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
      <div>
        {searchResult
          .slice(firstActionIndex, firstActionIndex + maxActions)
          .map((action, index) => (
            <FadeIn
              delay={`${
                Math.abs(selectedActionIndex - firstActionIndex - index) * 40
              }ms`}
              duration={400}
              key={`${action.label}-${index}`}
            >
              <ResultItem
                hide={hide}
                action={action}
                selected={firstActionIndex + index === selectedActionIndex}
              />
            </FadeIn>
          ))}
      </div>
    </Wrapper>
  )
}
