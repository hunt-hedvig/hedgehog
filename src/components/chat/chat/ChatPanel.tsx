import {
  MenuItem as MuiMenuItem,
  MenuList as MuiMenuList,
  TextField as MuiTextField,
  withStyles,
} from '@material-ui/core'
import * as React from 'react'
import { Icon } from 'semantic-ui-react'
import styled from 'styled-components'
import { EmojiPicker } from './EmojiPicker'

const MessagesPanelContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexShrink: 0,
  marginTop: 'auto',
  padding: '0.5rem',
})

const ChatForm = styled('form')({
  width: '100%',
  marginRight: '0.5rem',
})

const ActionContainer = styled('div')`
  position: relative;
`

const TextField = withStyles({
  root: {
    width: '100%',
    boxSizing: 'border-box',
  },
})(MuiTextField)

const MenuList = withStyles({
  root: {
    maxHeight: '175px',
    overflowY: 'scroll',
    marginTop: '0.5rem',
    backgroundColor: 'white',
  },
})(MuiMenuList)

const MenuItem = withStyles({
  root: {
    height: 'auto',
    overflow: 'auto',
    whiteSpace: 'normal',
  },
})(MuiMenuItem)

interface SuggestionProps {
  score: number
  text: string
}

interface ChatPanelProps {
  messages: object
  addMessage: () => void
}

interface ChatPanelState {
  message: string
  suggestions: SuggestionProps[]
  autocompleteResponse: SuggestionProps[]
  autocompleteQuery: string
}

export default class ChatPanel extends React.Component<
  ChatPanelProps,
  ChatPanelState
> {
  constructor(props: ChatPanelProps) {
    super(props)
    this.state = {
      message: '',
      suggestions: [],
      autocompleteResponse: [],
      autocompleteQuery: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.getAutocompleteSuggestions = this.getAutocompleteSuggestions.bind(this)
    this.fetchAutocompleteSuggestions = this.fetchAutocompleteSuggestions.bind(
      this,
    )
    this.setAutocompleteSuggestions = this.setAutocompleteSuggestions.bind(this)
    this.selectAutocompleteSuggestion = this.selectAutocompleteSuggestion.bind(
      this,
    )
  }

  public render() {
    const { message, suggestions } = this.state
    return (
      <MessagesPanelContainer>
        <ChatForm onSubmit={this.onSubmit}>
          <TextField
            multiline
            rowsMax="12"
            value={message}
            onChange={this.handleChange}
            margin="none"
            variant="outlined"
          />
          {!!suggestions.length && (
            <MenuList>
              {suggestions.map((suggestion: SuggestionProps) => {
                const { text } = suggestion
                return (
                  <MenuItem
                    key={text}
                    selected={message === text}
                    onClick={this.selectAutocompleteSuggestion}
                  >
                    {text}
                  </MenuItem>
                )
              })}
            </MenuList>
          )}
        </ChatForm>
        <ActionContainer>
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
        </ActionContainer>
      </MessagesPanelContainer>
    )
  }

  private handleChange(event: any) {
    const message = event.target.value
    if (!message) {
      return this.setState({ message: '', suggestions: [] })
    }
    this.setState({ message })
    this.getAutocompleteSuggestions(message)
  }

  private getAutocompleteSuggestions(message: string) {
    this.fetchAutocompleteSuggestions(message).then(
      this.setAutocompleteSuggestions,
    )
  }

  private fetchAutocompleteSuggestions(message: string) {
    return fetch(
      '/api/autocomplete/suggestions?query=' + encodeURIComponent(message),
    ).then((r) => r.json())
  }

  private setAutocompleteSuggestions = (suggestions: SuggestionProps[]) => {
    this.setState({ suggestions, autocompleteResponse: suggestions })
  }

  private selectAutocompleteSuggestion = (event: any) => {
    const { message } = this.state
    const suggestion = event.target.innerText
    const trimmedSuggestion = suggestion.trim()
    this.setState({
      message: trimmedSuggestion,
      suggestions: [],
      autocompleteQuery: message,
    })
  }

  private selectEmoji = (emoji: string) => {
    const emojiMessage = this.addEmojiToMessage(emoji)
    this.setState({ message: emojiMessage })
  }

  private onSubmit = () => {
    const { message } = this.state
    const { addMessage } = this.props
    if (message) {
      addMessage(message)
      this.setState({ message: '' })
      this.sendAutocompleteEvent()
    }
  }

  private sendAutocompleteEvent() {
    const { messages } = this.props
    const { message, autocompleteResponse, autocompleteQuery } = this.state
    return fetch('/api/autocomplete/select', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        autocomplete_response: autocompleteResponse,
        autocomplete_query: autocompleteQuery,
        submitted_response: {
          text: message,
          timestamp: Date.now() / 1000.0,
          authorType: 'admin',
        },
        user_messages: (messages || []).slice(-25),
      }),
    })
  }
}
