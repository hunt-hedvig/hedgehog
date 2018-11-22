import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Form, TextArea } from 'semantic-ui-react'
import styled from 'styled-components'
import { EmojiPicker } from './EmojiPicker'

const MessagesPanelContariner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: 20px;
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

const InputContainer = styled.div`
  width: 540px;
`

export default class ChatPanel extends React.Component<
  any,
  { message: string }
> {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
    }
  }

  public submitHandler = () => {
    const { message } = this.state
    if (message) {
      this.props.addMessage(message)
      this.setState({ message: '' })
    }
  }

  public inputHandler = (e, { value }) => {
    this.setState({ message: value })
  }

  public render() {
    return (
      <ChatForm onSubmit={this.submitHandler}>
        <MessagesPanelContariner>
          <InputContainer>
            <Form.Field>
              <label>Message</label>
              <TextArea
                autoHeight
                onChange={this.inputHandler}
                value={this.state.message}
              />
            </Form.Field>
          </InputContainer>
          <div>
            <EmojiPicker
              selectEmoji={(emoji) => {
                this.setState({ message: `${this.state.message}${emoji}` })
              }}
            />
            <Form.Button content="Send" primary />
          </div>
        </MessagesPanelContariner>
      </ChatForm>
    )
  }
}

ChatPanel.propTypes = {
  addMessage: PropTypes.func.isRequired,
}
