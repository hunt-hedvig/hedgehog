import { ActionMap, Container } from 'constate'
import { Picker } from 'emoji-mart'
import * as React from 'react'
import styled from 'react-emotion'
import { Icon } from 'semantic-ui-react'
import { emojiMartStyles } from './_emojimartstyles'

const Wrapper = styled('div')({
  position: 'absolute',
  maxHeight: '260px',
  maxWidth: '250px',
  bottom: 'calc(100% + 180px)',
  right: '95px',
})

interface EmojiPickerProps {
  selectEmoji: (emoji: string) => void
}

interface State {
  open: boolean
}

interface Actions {
  setIsOpen: (open: boolean) => void
}

const actions: ActionMap<State, Actions> = {
  setIsOpen: (open: boolean) => () => ({ open }),
}

export const EmojiPicker: React.SFC<EmojiPickerProps> = ({ selectEmoji }) => (
  <Container<State, Actions> initialState={{ open: false }} actions={actions}>
    {({ open, setIsOpen }) => (
      <>
        <Icon
          name={'smile outline'}
          size={'large'}
          link
          onClick={() => setIsOpen(!open)}
        />
        {open && (
          <Wrapper className={emojiMartStyles}>
            <Picker
              onSelect={(emoji) => {
                if (!(emoji as any).native) {
                  return
                }
                selectEmoji((emoji as any).native)
              }}
            />
          </Wrapper>
        )}
      </>
    )}
  </Container>
)
