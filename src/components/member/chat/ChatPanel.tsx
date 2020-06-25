import {
  Button as MuiButton,
  FormControlLabel as MuiFormControlLabel,
  Icon as MuiIcon,
  Switch as MuiSwitch,
  TextField as MuiTextField,
  withStyles,
} from '@material-ui/core'
import * as React from 'react'
import styled from 'react-emotion'
import { EmojiPicker } from './EmojiPicker'

const MessagesPanelContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexShrink: 0,
  flexWrap: 'wrap',
  marginTop: 'auto',
  padding: '0.5rem',
  backgroundColor: theme.backgroundLight,
  border: '1px solid ' + theme.borderStrong,
  borderTop: 0,
  borderBottomRightRadius: '0.5rem',
  borderBottomLeftRadius: '0.5rem',
}))

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
    verticalAlign: 'middle',
  },
})(MuiSwitch)

const SubmitButton = withStyles({
  root: {
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
})(MuiButton)

const TextField = withStyles({
  root: {
    width: '100%',
    boxSizing: 'border-box',
  },
})(MuiTextField)

interface ChatPanelProps {
  messages: ReadonlyArray<{}>
  addMessage: (message: string, forceSendMessage: boolean) => void
  memberId: string
  messageIds: string[]
}

interface State {
  currentMessage: string
  forceSendMessage: boolean
}

export class ChatPanel extends React.PureComponent<ChatPanelProps, State> {
  public state = {
    currentMessage: '',
    forceSendMessage: false,
  }

  public render() {
    return (
      <MessagesPanelContainer>
        <ChatForm onSubmit={this.handleSubmit}>
          <TextField
            multiline
            rowsMax="12"
            margin="none"
            variant="outlined"
            value={this.state.currentMessage}
            onChange={this.handleInputChange}
            onKeyDown={(event) => {
              if (this.shouldSubmit(event)) {
                event.preventDefault()
                this.sendMessage()
              }
            }}
          />
        </ChatForm>

        <ActionContainer>
          <EmojiPicker selectEmoji={this.selectEmoji} />
        </ActionContainer>

        <OptionsContainer>
          <MuiFormControlLabel
            label="Force message"
            labelPlacement="start"
            control={
              <OptionCheckbox
                color="primary"
                checked={this.state.forceSendMessage}
                onChange={this.handleForceSendMessageCheckboxChange}
              />
            }
          />

          <SubmitButton
            variant="contained"
            color="primary"
            onClick={(event) => {
              event.preventDefault()
              this.sendMessage()
            }}
          >
            Send
            <MuiIcon>send</MuiIcon>
          </SubmitButton>
        </OptionsContainer>
      </MessagesPanelContainer>
    )
  }

  private shouldSubmit = (e: React.KeyboardEvent<any>) => {
    return (
      !window.matchMedia('(max-width: 800px)').matches &&
      e.keyCode === 13 &&
      !e.shiftKey
    )
  }

  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const message = e.currentTarget.value
    this.setState({
      currentMessage: message,
    })
  }

  private handleForceSendMessageCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.setState({ forceSendMessage: e.target.checked })
  }

  private handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<Element, MouseEvent>,
  ) => {
    e.preventDefault()
    this.sendMessage()
  }

  private sendMessage = () => {
    this.props.addMessage(
      this.state.currentMessage,
      this.state.forceSendMessage,
    )
    this.setState({
      currentMessage: '',
      forceSendMessage: false,
    })
  }

  private selectEmoji = (emoji: string) => {
    this.setState(({ currentMessage }) => ({
      currentMessage: currentMessage + emoji,
    }))
  }
}
