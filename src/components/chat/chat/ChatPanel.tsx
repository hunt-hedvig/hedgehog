import {
  Button as MuiButton,
  Checkbox as MuiCheckbox,
  FormControlLabel as MuiFormControlLabel,
  Icon as MuiIcon,
  MenuItem as MuiMenuItem,
  MenuList as MuiMenuList,
  Switch as MuiSwitch,
  TextField as MuiTextField,
  withStyles,
} from '@material-ui/core'
import { format } from 'date-fns'
import * as React from 'react'
import styled from 'react-emotion'
import { Icon } from 'semantic-ui-react'
import { EmojiPicker } from './EmojiPicker'

const MessagesPanelContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexShrink: 0,
  flexWrap: 'wrap',
  marginTop: 'auto',
  padding: '0.5rem',
})

const ChatForm = styled('form')({
  marginLeft: '16px',
  width: 'calc(100% - 3em - 16px)',
  marginRight: '0.5rem',
})

const ActionContainer = styled('div')`
  position: relative;
  width: 2em;
  text-align: right;
`

const OptionsContainer = styled('div')`
  width: 100%;
  display: flex;
`

const OptionCheckbox = withStyles({
  root: {
    verticalAlign: 'middle'
  },
})(MuiSwitch)

const SubmitButton = withStyles({
  root: {
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
})(MuiButton)


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
  addMessage: (message: string, forceSendMessage: boolean) => void
}

interface State {
  currentMessage: string
  autocompleteSuggestions: ReadonlyArray<AutocompleteSuggestion>
  autocompleteQuery: string | null
  showAutocompleteSuggestions: boolean
  forceSendMessage: boolean
}

interface AutocompleteSuggestion {
  score: number
  text: string
}

export class ChatPanel extends React.PureComponent<ChatPanelProps, State> {
  public state = {
    currentMessage: '',
    forceSendMessage: false,
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
            onKeyDown={this.handleEnterMaybe}
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
        </ActionContainer>
        <OptionsContainer>
          <MuiFormControlLabel
            label="Force message"
            labelPlacement="start"
            control = {
              <OptionCheckbox  color="primary" checked={this.state.forceSendMessage} onChange={this.handleCheckboxChange} />
            }
          />
          <SubmitButton variant="raised"  onClick={this.handleSubmit}  color="primary" >
        Send
        {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
        <MuiIcon >send</MuiIcon>
      </SubmitButton>
        </OptionsContainer>
      </MessagesPanelContainer>
    )
  }

  private handleEnterMaybe = (e: React.KeyboardEvent<any>) => {
    if (window.matchMedia('(max-width: 800px)').matches) {
      return
    }
    if (e.keyCode !== 13) {
      return
    }
    if (e.shiftKey) {
      return
    }

    e.preventDefault()
    this.sendMessage()
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

  private handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({forceSendMessage: e.target.checked,})
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

  private handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault()
    this.sendMessage()
  }
  private sendMessage = () => {
    this.props.addMessage(this.state.currentMessage, this.state.forceSendMessage)
    this.trackAutocompleteMessage()
    this.setState({
      autocompleteSuggestions: [],
      currentMessage: '',
      showAutocompleteSuggestions: false,
      forceSendMessage: false,
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
