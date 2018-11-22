import { ActionMap, Container } from 'constate'
import { Picker } from 'emoji-mart'
import * as React from 'react'
import styled from 'react-emotion'
import { Button } from 'semantic-ui-react'
import { emojiMartStyles } from './_emojimartstyles'

const Wrapper = styled('div')({
  position: 'absolute',
  top: '-200%',
  left: '100%',
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
  setIsOpen: (open: boolean) => (state) => ({ ...state, open }),
}

export const EmojiPicker: React.SFC<EmojiPickerProps> = ({ selectEmoji }) => (
  <Container<State, Actions> initialState={{ open: false }} actions={actions}>
    {({ open, setIsOpen }) => (
      <>
        <Button type="button" onClick={() => setIsOpen(!open)}>
          {open ? 'Close' : 'Open'} emoji picker
        </Button>
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
