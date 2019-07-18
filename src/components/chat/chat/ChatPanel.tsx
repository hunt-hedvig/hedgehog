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
import { EmojiPicker } from './EmojiPicker'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'

const MessagesPanelContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexShrink: 0,
  flexWrap: 'wrap',
  marginTop: 'auto',
  padding: '0.5rem',
  border: '2px solid #cccccc',
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

const ShowMoreRepliesButton = withStyles({
  root: {
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '100%',
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

const AUTO_LABEL_QUESTION = gql`
  mutation AutoLabelQuestion(
    $question: String!
    $label: String!
    $memberId: String
    $messageIds: [String!]
  ) {
    autoLabelQuestion(
      question: $question
      label: $label
      memberId: $memberId
      messageIds: $messageIds
    ) {
      message
    }
  }
`

interface ChatPanelProps {
  messages: ReadonlyArray<{}>
  addMessage: (message: string, forceSendMessage: boolean) => void
  suggestedAnswer: string
  questionToLabel: string
  memberId: string
  messageIds: string
  allReplies: any
}

interface State {
  currentMessage: string
  autocompleteSuggestions: ReadonlyArray<AutocompleteSuggestion>
  autocompleteQuery: string | null
  showAutocompleteSuggestions: boolean
  forceSendMessage: boolean
  chosenIntent: string
  showMoreReplies: boolean
  shouldAutoLabel: boolean
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
    chosenIntent: 'other',
    showMoreReplies: false,
    shouldAutoLabel: true,
  }

  public render() {
    const allReplies = this.props.allReplies
    const allIntents = this.getAllIntents(allReplies)

    return (
      <Mutation mutation={AUTO_LABEL_QUESTION} ignoreResults={true}>
        {(autoLabelQuestion) => (
          <MessagesPanelContainer>
            <ChatForm onSubmit={this.handleSubmit}>
              {this.props.questionToLabel !== '' && (
                <div>
                  <MenuList>
                    {allIntents!.map((intent) => {
                      const text = this.getReply(allReplies, intent)
                      return (
                        this.shouldShowSuggestedAnswer(text) && (
                          <MenuItem
                            key={text}
                            onClick={this.selectAnswerSuggestion(
                              intent,
                              allReplies,
                            )}
                          >
                            {text}
                          </MenuItem>
                        )
                      )
                    })}
                  </MenuList>
                  <ShowMoreRepliesButton
                    variant="outlined"
                    color="default"
                    onClick={this.toggleMoreReplies}
                  >
                    {this.state.showMoreReplies
                      ? 'Hide replies'
                      : 'Show more replies'}
                  </ShowMoreRepliesButton>
                </div>
              )}

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
                    if (
                      this.props.questionToLabel !== '' &&
                      this.state.shouldAutoLabel
                    ) {
                      autoLabelQuestion({
                        variables: {
                          question: this.props.questionToLabel,
                          label: this.state.chosenIntent,
                          memberId: this.props.memberId,
                          messageIds: this.props.messageIds,
                        },
                      })
                      this.sendMessage()
                    } else {
                      this.sendMessage()
                    }
                  }
                }}
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
                control={
                  <OptionCheckbox
                    color="primary"
                    checked={this.state.forceSendMessage}
                    onChange={this.handleCheckboxChange}
                  />
                }
              />

              <MuiFormControlLabel
                label="Send feedback"
                labelPlacement="start"
                control={
                  <OptionCheckbox
                    color="secondary"
                    checked={this.state.shouldAutoLabel}
                    onChange={this.handleAutoLabelCheckboxChange}
                  />
                }
              />

              <SubmitButton
                variant="contained"
                color="primary"
                onClick={(event) => {
                  event.preventDefault()
                  if (
                    this.props.questionToLabel !== '' &&
                    this.state.shouldAutoLabel
                  ) {
                    autoLabelQuestion({
                      variables: {
                        question: this.props.questionToLabel,
                        label: this.state.chosenIntent,
                        memberId: this.props.memberId,
                        messageIds: this.props.messageIds,
                      },
                    })
                    this.sendMessage()
                  } else {
                    this.sendMessage()
                  }
                }}
              >
                Send
                <MuiIcon>send</MuiIcon>
              </SubmitButton>
            </OptionsContainer>
          </MessagesPanelContainer>
        )}
      </Mutation>
    )
  }
  private shouldShowSuggestedAnswer = (text: string) => {
    return (
      this.state.showMoreReplies ||
      (!this.state.showMoreReplies && this.props.suggestedAnswer === text)
    )
  }

  private getReply = (allReplies: object, intent: string) => {
    const message = allReplies.find((message) => message.intent === intent)
    return message.reply
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
    if (message.length > 0) {
      this.findAutocompleteSuggestions(message)
    } else {
      this.setState({
        showAutocompleteSuggestions: false,
        chosenIntent: 'other',
      })
    }
  }

  private handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ forceSendMessage: e.target.checked })
  }

  private handleAutoLabelCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.setState({ shouldAutoLabel: e.target.checked })
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

  private getAllIntents = (allReplies: object) => {
    const allIntents = allReplies
      ? allReplies
          .map((message) => message.intent)
          .filter((key) => key !== 'other')
      : []

    return allIntents
  }

  private toggleMoreReplies = () => {
    this.setState({ showMoreReplies: !this.state.showMoreReplies })
  }

  private selectAnswerSuggestion = (intent: string, allReplies: object) => (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    this.setState({
      chosenIntent: intent,
      currentMessage: this.getReply(allReplies, intent),
      showMoreReplies: false,
    })
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
    this.trackAutocompleteMessage()
    this.setState({
      autocompleteSuggestions: [],
      currentMessage: '',
      showAutocompleteSuggestions: false,
      forceSendMessage: false,
      chosenIntent: 'other',
      showMoreReplies: false,
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
