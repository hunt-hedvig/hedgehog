import { ActionMap, Container } from 'constate'
import React, { lazy, Suspense } from 'react'
import { Global } from '@emotion/react'
import styled from '@emotion/styled'
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

const LazyEmojiPicker = lazy(
  () =>
    import(
      /* webpackChunkName: 'emoji-mart' */ 'emoji-mart/dist-es'
    ).then(({ Picker }) => ({ default: Picker })) as any,
)

export const EmojiPicker: React.SFC<EmojiPickerProps> = ({ selectEmoji }) => {
  return (
    <Container<State, Actions> initialState={{ open: false }} actions={actions}>
      {({ open, setIsOpen }) => (
        <>
          <Global styles={emojiMartStyles} />
          <Icon
            name={'smile outline'}
            size={'large'}
            link
            onClick={() => setIsOpen(!open)}
          />
          {open && (
            <Wrapper>
              <Suspense fallback="...">
                <LazyEmojiPicker
                  onSelect={(emoji) => {
                    if (!(emoji as any).native) {
                      return
                    }
                    selectEmoji((emoji as any).native)
                  }}
                />
              </Suspense>
            </Wrapper>
          )}
        </>
      )}
    </Container>
  )
}
