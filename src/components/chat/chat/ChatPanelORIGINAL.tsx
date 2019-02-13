import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Form, Icon, TextArea } from 'semantic-ui-react'
import styled from 'styled-components'
import { EmojiPicker } from './EmojiPicker'

const MessagesPanelContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: 5px;
  border-top: solid 2px #e8e5e5;
  height: 85px;
`

const ChatForm = styled(Form)`
  z-index: 10000;

  & .selection.dropdown {
    min-width: 130px;

    & .menu {
      max-height: 100px;
    }
  }

  & .primary.button {
    margin-top: 23px;
  }
`

const TextAreaStyled = styled(TextArea)`
  height: 75px !important;
`

const InputContainer = styled.div`
  width: 540px;
`

const AutocompleteItems = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: '0 2px 4px 0 rgba(34, 36, 38, 0.12)';
  max-height: 150px;
  overflow-y: scroll;
`

const AutocompleteItem = styled.button`
  flex-shrink: 0;
  background: ${({ isFocused }: { isFocused: boolean }) =>
    isFocused ? 'rgba(0,0,0,0.05)' : 'transparent'};
  color: blue;
  padding: 5px;
  border: 0;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  text-align: left;
  cursor: pointer;
`

interface SuggestionProps {
  score: number
  text: string
}

interface State {
  message: string
  suggestions: SuggestionProps[]
  focusedSuggestionIndex: number | null
}

export default class ChatPanel extends React.Component<any, State> {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      suggestions: [],
      focusedSuggestionIndex: null,
    }
  }

  public onSubmit = () => {
    const { message } = this.state
    if (message) {
      this.props.addMessage(message)
      this.setState({ message: '' })
    }
  }

  public onInputChange = (e, { value }: { value: string }) => {
    this.setState({ message: value })
    this.updateAutocompleteSuggestions(value)
  }

  public addEmojiToMessage(emoji: string) {
    const { message } = this.state
    return `${message}${emoji}`
  }

  public selectEmoji = (emoji: string) => {
    const emojiMessage = this.addEmojiToMessage(emoji)
    this.setState({ message: emojiMessage })
  }

  public selectAutocompleteSuggestion = (suggestion: string) => {
    this.setState({ message: suggestion, suggestions: [] })
  }

  public onTextAreaKeyPress = (e) => {
    if (e && e.charCode === 13 && !e.shiftKey) {
      this.onSubmit()
    }
  }

  public onTextAreaKeyDown = (e) => {
    if (e && e.keyCode === 38) {
      this.onTextAreaUpKey()
    }
    if (e && e.keyCode === 40) {
      this.onTextAreaDownKey()
    }
  }

  public onTextAreaUpKey = () => {
    const { suggestions, focusedSuggestionIndex } = this.state
    const suggestionsLength = suggestions.length
    let newFocusedSuggestionIndex = null
    if (!!suggestionsLength) {
      if (!focusedSuggestionIndex) {
        newFocusedSuggestionIndex = suggestionsLength
      }
      if (
        focusedSuggestionIndex &&
        focusedSuggestionIndex <= suggestionsLength
      ) {
        newFocusedSuggestionIndex = focusedSuggestionIndex - 1
      }
    }
    this.setFocusAutoCompleteSuggestion(newFocusedSuggestionIndex)
  }

  public onTextAreaDownKey = () => {
    const { suggestions, focusedSuggestionIndex } = this.state
    const suggestionsLength = suggestions.length
    let newFocusedSuggestionIndex = null
    if (!!suggestionsLength) {
      if (!focusedSuggestionIndex) {
        newFocusedSuggestionIndex = 0
      }
      if (focusedSuggestionIndex < suggestionsLength) {
        newFocusedSuggestionIndex = focusedSuggestionIndex + 1
      }
      if (focusedSuggestionIndex === suggestionsLength) {
        newFocusedSuggestionIndex = 0
      }
    }
    this.setFocusAutoCompleteSuggestion(newFocusedSuggestionIndex)
  }

  public setFocusAutoCompleteSuggestion(index) {
    this.setState({ focusedSuggestionIndex: index })
  }

  public setAutocompleteSuggestions = (suggestions: SuggestionProps[]) => {
    this.setState({ suggestions })
  }

  public getAutocompleteSuggestions(message: string) {
    return fetch(
      '/v0/messages/autocomplete?query=' + encodeURIComponent(message),
    ).then((r) => r.json())
  }

  public updateAutocompleteSuggestions(message: string) {
    this.getAutocompleteSuggestions(message).then(
      this.setAutocompleteSuggestions,
    )
  }

  public render() {
    const { message, suggestions, focusedSuggestionIndex } = this.state
    return (
      <ChatForm onSubmit={this.onSubmit}>
        <MessagesPanelContainer>
          <InputContainer>
            <Form.Field>
              <TextAreaStyled
                autoHeight
                onChange={this.onInputChange}
                value={message}
                onKeyDown={this.onTextAreaKeyDown}
                onKeyPress={this.onTextAreaKeyPress}
              />
            </Form.Field>
            {!!suggestions.length && (
              <AutocompleteItems>
                {suggestions.map(({ text }, index) => {
                  return (
                    <AutocompleteItem
                      key={text}
                      isFocused={index === focusedSuggestionIndex}
                      onClick={(e) => {
                        e.preventDefault()
                        this.selectAutocompleteSuggestion(text)
                      }}
                    >
                      {text}
                    </AutocompleteItem>
                  )
                })}
              </AutocompleteItems>
            )}
          </InputContainer>
          <div>
            <EmojiPicker
              selectEmoji={(emoji) => {
                this.selectEmoji(emoji)
              }}
            />
            <Icon
              name={'arrow circle right'}
              color={'blue'}
              size={'large'}
              link
              onClick={this.onSubmit}
            />
          </div>
        </MessagesPanelContainer>
      </ChatForm>
    )
  }
}

ChatPanel.propTypes = {
  addMessage: PropTypes.func.isRequired,
}
