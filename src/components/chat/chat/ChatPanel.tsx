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
import axios from 'axios'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Button, Dropdown } from 'semantic-ui-react'


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
  mutation AutoLabelQuestion($question: String!, $label: String!, $memberId: String, $messageId: [String!]) {
    autoLabelQuestion(question: $question, label: $label, memberId: $memberId, messageId: $messageId){
      message

    }
  }
`;

interface ChatPanelProps {
  messages: ReadonlyArray<{}>
  addMessage: (message: string, forceSendMessage: boolean) => void
  suggestedAnswer: string
  questionToLabel: string
  memberId: string
  messageId: string
  allReplies: JSON
}

interface State {
  currentMessage: string
  autocompleteSuggestions: ReadonlyArray<AutocompleteSuggestion>
  autocompleteQuery: string | null
  showAutocompleteSuggestions: boolean
  forceSendMessage: boolean
  chosenIntent: string
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
    chosenIntent: 'other'
  }

  public render() {

    const allReplies = this.props.allReplies;
    const allIntents = this.getAllIntents(allReplies);


    return (    
      
      <MessagesPanelContainer>

        <ChatForm onSubmit={this.handleSubmit}>          
          
            {/* there doesnt exist a function for changing his.props.suggestedAnswer to true now since the page is refreshed anyways*/}
            {this.props.questionToLabel !== '' && (            
              
                <div>
                <MenuList>

                {allIntents!.map((intent) => {
                  //strip \n 
                  const  text  = allReplies[intent].reply.replace(/(\r\n|\n|\r)/gm, "");
                  return (
                    <MenuItem
                      key={text}
                      selected={this.props.suggestedAnswer === text}
                      onClick={this.selectAnswerSuggestion(intent, allReplies)}
                    >
                      {text}
                    </MenuItem>
                  )
                })}

                </MenuList>
                <ShowMoreRepliesButton
              variant="raised"
              color="default"
              onClick= {this.handleSubmit}              
              >Show more replies
             
             </ShowMoreRepliesButton>
             </div>
              )                
            }        

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
            control={
              <OptionCheckbox
                color="primary"
                checked={this.state.forceSendMessage}
                onChange={this.handleCheckboxChange}
              />
            }
          />

          {/* Only make mutation if last message was from member*/}
          {this.props.questionToLabel !== '' ? (
          <Mutation mutation= {AUTO_LABEL_QUESTION} ignoreResults = {true} onCompleted = {this.handleSubmit}
            onError = {this.handleSubmit}>
            {(autoLabelQuestion) => (

              <SubmitButton
              variant="raised"
              color="primary"
              onClick= { event => 
                  {            
                    event.preventDefault();                    
                    autoLabelQuestion({ variables: { question: this.props.questionToLabel, 
                      label: this.state.chosenIntent, memberId: this.props.memberId, messageId: this.props.messageId } });                                    
                  }}              
              >
              Send
             <MuiIcon>send</MuiIcon>
             </SubmitButton>                 

              )                
            }              

            </Mutation>) : ( 
          <SubmitButton
              variant="raised"
              color="primary"
              onClick= {this.handleSubmit}              
              >
              Send
             <MuiIcon>send</MuiIcon>
             </SubmitButton> ) 
        }

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
      //If the message is deleted => the label is reset to other class
      this.setState({ showAutocompleteSuggestions: false, chosenIntent: 'other' })      
    }
  }

  private handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ forceSendMessage: e.target.checked })
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

  //takes an object with intents as keys
  private getAllIntents = (allReplies: array) => {

    var allIntents = [];

    //appending all intents/keys to array, except from other class
    for (var key in allReplies) {
    if (allReplies.hasOwnProperty(key) && key !== "other") {
        allIntents.push(key)
      }
    }

    return allIntents;
  } 

  private selectAnswerSuggestion = (intent: string, allReplies: array) => (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    //e.preventDefault()    
    this.setState({
      chosenIntent: intent,
      currentMessage: allReplies[intent].reply.replace(/(\r\n|\n|\r)/gm, ""),
    })
  }


  private handleSubmit = (
   // e: React.FormEvent<HTMLFormElement> | React.MouseEvent<Element, MouseEvent>,
  ) => {
   // e.preventDefault()
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
