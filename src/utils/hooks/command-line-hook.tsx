import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { Input } from 'hedvig-ui/input'
import { FourthLevelHeadline, Paragraph } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import { Icon } from 'semantic-ui-react'
import { KeyCode, useKeyIsPressed } from 'utils/hooks/key-press-hook'

export const CommandLineContext = React.createContext({})

const CommandLineWindow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 1);
  box-shadow: -1px -1px 42px 0px rgba(0, 0, 0, 0.25);
  -webkit-box-shadow: -1px -1px 42px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: -1px -1px 42px 0px rgba(0, 0, 0, 0.25);
  border-radius: 0.3em;
  height: 400px;
`

const CharacterBadge: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.1)',
        padding: '0.35em 0.55em',
        borderRadius: '0.3em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '0.4em',
      }}
    >
      <Paragraph style={{ fontSize: '0.8em', fontWeight: 'bold' }}>
        {content}
      </Paragraph>
    </div>
  )
}

const ResultItem: React.FC<{
  label: string
  characters: string[]
  selected?: boolean
}> = ({ label, characters, selected = false }) => {
  return (
    <div
      style={{
        padding: '1.0em 3.5em',
        paddingRight: '1.0em',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: selected ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
      }}
    >
      <FourthLevelHeadline>{label}</FourthLevelHeadline>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {characters.map((character) => (
          <CharacterBadge key={character} content={character} />
        ))}
      </div>
    </div>
  )
}

const CommandLineComponent: React.FC<{}> = ({}) => {
  const [value, setValue] = React.useState('')
  const [selectedItem, setSelectedItem] = React.useState(0)

  const isUpPressed = useKeyIsPressed(KeyCode.Up)
  const isDownPressed = useKeyIsPressed(KeyCode.Down)

  React.useEffect(() => {
    if (isUpPressed && selectedItem > 0) {
      setSelectedItem(selectedItem - 1)
    }

    if (isDownPressed && selectedItem < mockData.length - 1) {
      setSelectedItem(selectedItem + 1)
    }
  }, [isUpPressed, isDownPressed])

  const mockData = [
    { label: 'Help a bro', characters: ['⌥', 'B'] },
    { label: 'Call a bro', characters: ['⌥', 'C'] },
    { label: 'Arrest a bro', characters: ['⌥', 'A'] },
  ]

  return (
    <CommandLineWindow>
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.0)',
          width: '100%',
        }}
      >
        <Input
          autoFocus
          value={value}
          onChange={({ target }) => {
            if (target.value === ' ' || target.value === ' ') {
              return
            }

            setValue(target.value)
          }}
          icon={<Icon name="search" style={{ marginLeft: '1em' }} />}
          iconPosition="left"
          placeholder="What can I help you with?"
          transparent
          size={'large'}
          style={{ width: '60vh', padding: '1em 1em' }}
        />
      </div>
      {value !== '' &&
        mockData.map(({ label, characters }, index) => (
          <FadeIn delay={`${index * 50}ms`}>
            <ResultItem
              label={label}
              characters={characters}
              selected={index === selectedItem}
            />
          </FadeIn>
        ))}
    </CommandLineWindow>
  )
}

export const CommandLineProvider: React.FC = ({ children }) => {
  const [showCommandLine, setShowCommandLine] = React.useState(false)

  const isOptionPressed = useKeyIsPressed(KeyCode.Option)
  const isSpacePressed = useKeyIsPressed(KeyCode.Space)
  const isEscapePressed = useKeyIsPressed(KeyCode.Escape)

  React.useEffect(() => {
    if (isOptionPressed && isSpacePressed) {
      setShowCommandLine(true)
    }
  }, [isOptionPressed, isSpacePressed])

  React.useEffect(() => {
    setShowCommandLine(false)
  }, [isEscapePressed])

  return (
    <CommandLineContext.Provider value={{}}>
      {children}
      {showCommandLine && <CommandLineComponent />}
    </CommandLineContext.Provider>
  )
}
