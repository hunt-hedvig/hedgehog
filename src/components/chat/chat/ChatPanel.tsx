import { format } from 'date-fns'
import * as React from 'react'
import ReactAutocomplete from 'react-autocomplete'
import { Form, Icon } from 'semantic-ui-react'
import styled from 'styled-components'
import { EmojiPicker } from './EmojiPicker'

const MessagesPanelContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: 5px;
  border-top: solid 2px #e8e5e5;
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

const AutocompleteItems = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12);
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
  autocompleteResponse: SuggestionProps[]
  autocompleteQuery: string
}

export default class ChatPanel extends React.Component<any, State> {
  public defaultProps = {
    messages: [],
  }
  constructor(props: object) {
    super(props)
    this.state = {
      message: '',
      suggestions: [],
      autocompleteResponse: [],
      autocompleteQuery: '',
    }
  }

  public onSubmit = () => {
    const { message } = this.state
    if (message) {
      this.props.addMessage(message)
      if (this.state.autocompleteQuery) {
        this.sendAutocompleteEvent(this.state)
      }
      this.setState({ message: '', autocompleteQuery: '' })
    }
  }

  public onInputChange = (e: any) => {
    const value = e.target.value
    if (!value) {
      return this.setState({ message: '', suggestions: [] })
    }
    this.setState({ message: value })
    this.getAutocompleteSuggestions(value)
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
    const { message } = this.state
    this.setState({
      message: suggestion,
      suggestions: [],
      autocompleteQuery: message,
    })
  }

  public setAutocompleteSuggestions = (suggestions: SuggestionProps[]) => {
    this.setState({ suggestions, autocompleteResponse: suggestions })
  }

  public fetchAutocompleteSuggestions(message: string) {
    return fetch(
      '/api/autocomplete/suggestions?query=' + encodeURIComponent(message),
    ).then((r) => r.json())
  }

  public getAutocompleteSuggestions(message: string) {
    this.fetchAutocompleteSuggestions(message).then(
      this.setAutocompleteSuggestions,
    )
  }

  public sendAutocompleteEvent(state: State) {
    const { messages } = this.props
    const { message, autocompleteResponse, autocompleteQuery } = state
    return fetch('/api/autocomplete/select', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        autocompleteResponse,
        autocompleteQuery,
        submittedResponse: {
          text: message,
          timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
          authorType: 'admin',
        },
        chatHistory: (messages || []).slice(-25),
      }),
    })
  }

  public render() {
    const { message, suggestions } = this.state
    return (
      <ChatForm onSubmit={this.onSubmit}>
        <MessagesPanelContainer>
          <ReactAutocomplete
            getItemValue={({ text }: SuggestionProps) => text}
            items={suggestions}
            renderItem={(
              suggestion: SuggestionProps,
              isHighlighted: boolean,
            ) => {
              const { text } = suggestion
              return (
                <AutocompleteItem key={text} isFocused={isHighlighted}>
                  {text}
                </AutocompleteItem>
              )
            }}
            value={message}
            renderMenu={(components, _, style: object) => {
              return (
                <AutocompleteItems style={{ ...style }}>
                  {components}
                </AutocompleteItems>
              )
            }}
            onChange={this.onInputChange}
            onSelect={this.selectAutocompleteSuggestion}
            wrapperStyle={{ width: '100%' }}
          />
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
