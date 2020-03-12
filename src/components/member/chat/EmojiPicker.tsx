import { ActionMap, Container } from 'constate'
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
  zIndex: 999999,
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

const LazyEmojiPicker = React.lazy(
  () =>
    import(
      /* webpackChunkName: 'emoji-mart' */ 'emoji-mart'
    ).then(({ Picker }) => ({ default: Picker })) as any,
)

emojiMartStyles()
export const EmojiPicker: React.SFC<EmojiPickerProps> = ({ selectEmoji }) => {
  return (
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
            <Wrapper>
              <React.Suspense fallback="...">
                <LazyEmojiPicker
                  onSelect={(emoji) => {
                    if (!(emoji as any).native) {
                      return
                    }
                    selectEmoji((emoji as any).native)
                  }}
                />
              </React.Suspense>
            </Wrapper>
          )}
        </>
      )}
    </Container>
  )
}
