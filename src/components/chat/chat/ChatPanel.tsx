import {
  MenuItem as MuiMenuItem,
  MenuList as MuiMenuList,
  TextField as MuiTextField,
  withStyles,
} from '@material-ui/core'
import * as React from 'react'
import styled from 'react-emotion'
import { Icon } from 'semantic-ui-react'
import { EmojiPicker } from './EmojiPicker'
import { format } from 'date-fns';

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

interface ChatPanelProps {
  messages: ReadonlyArray<{}>
  addMessage: (message: string) => void
}

interface State {
  currentMessage: string
  autocompleteSuggestions: ReadonlyArray<AutocompleteSuggestion>
  autocompleteQuery: string | null
  showAutocompleteSuggestions: boolean
}

interface AutocompleteSuggestion {
  score: number
  text: string
}

export class ChatPanel extends React.PureComponent<ChatPanelProps, State> {
  public state = {
    currentMessage: '',
    autocompleteQuery: null,
    autocompleteSuggestions: [],
    showAutocompleteSuggestions: false,
  }

  public render() {
    return (
      <MessagesPanelContainer>
        <ChatForm onSubmit={this.handleSubmit}>
          <TextField
            multiline
            rowsMax="12"
            value={this.state.currentMessage}
            onChange={this.handleInputChange}
            margin="none"
            variant="outlined"
          />
          {this.state.showAutocompleteSuggestions &&
            this.state.autocompleteSuggestions && (
              <MenuList>
                {this.state.autocompleteSuggestions!.map((suggestion) => {
                  const { text } = suggestion
                  return (
                    <MenuItem
                      key={text}
                      selected={this.state.currentMessage === text}
                      onClick={this.selectAutocompleteSuggestion(text)}
                    >
                      {text}
                    </MenuItem>
                  )
                })}
              </MenuList>
            )}
        </ChatForm>
        <ActionContainer>
          <EmojiPicker selectEmoji={this.selectEmoji} />
          <Icon
            name="arrow circle right"
            color="blue"
            size="large"
            link
            onClick={this.handleSubmit}
          />
        </ActionContainer>
      </MessagesPanelContainer>
    )
  }

  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const message = e.currentTarget.value
    this.setState({
      currentMessage: message,
    })
    if (message.length > 0) {
      this.findAutocompleteSuggestions(message)
    } else {
      this.setState({ showAutocompleteSuggestions: false })
    }
  }

  private findAutocompleteSuggestions = (query: string) => {
    fetch('/api/autocomplete/suggestions?query=' + encodeURIComponent(query))
      .then((r) => {
        if (r.status !== 200) {
          throw new Error(
            `Invalid response code ${
              r.status
            } received when fetching autocomple suggestions`,
          )
        }
        return r
      })
      .then((response) => response.json())
      .then((suggestions) => {
        this.setState({
          autocompleteQuery: query,
          autocompleteSuggestions: suggestions,
          showAutocompleteSuggestions: true,
        })
      })
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.addMessage(this.state.currentMessage)
    this.trackAutocompleteMessage()
    this.setState({
      autocompleteSuggestions: [],
      currentMessage: '',
      showAutocompleteSuggestions: false,
    })
  }
  private selectAutocompleteSuggestion = (suggestion: string) => (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()
    this.setState({
      currentMessage: suggestion,
      showAutocompleteSuggestions: false,
    })
  }

  private selectEmoji = (emoji: string) => {
    this.setState(({ currentMessage }) => ({
      currentMessage: currentMessage + emoji,
    }))
  }

  private trackAutocompleteMessage = () => {
    fetch('/api/autocomplete/select', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        autocompleteResponse: this.state.autocompleteSuggestions,
        autocompleteQuery: this.state.autocompleteQuery,
        submittedResponse: {
          text: this.state.currentMessage,
          timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'.0Z'"),
          authorType: 'admin',
        },
        chatHistory: (this.props.messages || [])
          .slice(-25)
          .map((historyMessage: any) => {
            const authorType =
              historyMessage.author === null
                ? historyMessage.header.fromId === 1
                  ? 'bot'
                  : 'user'
                : 'admin'
            return {
              authorType,
              text: historyMessage.body.text,
              timestamp: historyMessage.timestamp,
            }
          }),
      }),
    })
  }
}
