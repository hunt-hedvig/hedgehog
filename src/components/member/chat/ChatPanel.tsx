import {
  FormControlLabel as MuiFormControlLabel,
  Switch as MuiSwitch,
  TextField as MuiTextField,
  withStyles,
} from '@material-ui/core'
import { getSendMessageOptions, useSendMessage } from 'graphql/use-send-message'
import { Button } from 'hedvig-ui/button'
import React, { useState } from 'react'
import { ChevronRight } from 'react-bootstrap-icons'
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
  justify-content: space-between;
`

const OptionCheckbox = withStyles({
  root: {
    verticalAlign: 'middle',
  },
})(MuiSwitch)

const SubmitButton = styled(Button)`
  margin: 1rem;
`

const TextField = withStyles({
  root: {
    width: '100%',
    boxSizing: 'border-box',
  },
})(MuiTextField)

export const ChatPanel = ({ memberId }) => {
  const [currentMessage, setCurrentMessage] = useState('')
  const [forceSendMessage, setForceSendMessage] = useState(false)
  const [error, setError] = useState(false)
  const [sendMessage, { loading }] = useSendMessage()

  const shouldSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
    return (
      !window.matchMedia('(max-width: 800px)').matches &&
      e.keyCode === 13 &&
      !e.shiftKey
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) {
      return
    }
    const message = e.currentTarget.value
    setCurrentMessage(message)
    setError(false)
  }

  const handleForceSendMessageCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForceSendMessage(e.target.checked)
  }

  const handleSubmit = () => {
    if (loading) {
      return
    }
    sendMessage(
      getSendMessageOptions(memberId, currentMessage, forceSendMessage),
    )
      .then(() => {
        setCurrentMessage('')
        setForceSendMessage(false)
        setError(false)
      })
      .catch((e) => {
        setError(true)
        console.error(e)
      })
  }

  const selectEmoji = (emoji: string) => {
    setCurrentMessage(currentMessage + emoji)
  }

  return (
    <MessagesPanelContainer>
      <ChatForm onSubmit={handleSubmit}>
        <TextField
          autoFocus
          error={error}
          multiline
          rows={4}
          rowsMax="12"
          margin="none"
          variant="outlined"
          value={currentMessage}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (shouldSubmit(event)) {
              event.preventDefault()
              handleSubmit()
            }
          }}
        />
      </ChatForm>

      <ActionContainer>
        <EmojiPicker selectEmoji={selectEmoji} />
      </ActionContainer>

      <OptionsContainer>
        <MuiFormControlLabel
          label="Force message"
          labelPlacement="start"
          control={
            <OptionCheckbox
              color="primary"
              checked={forceSendMessage}
              onChange={handleForceSendMessageCheckboxChange}
            />
          }
        />

        <SubmitButton
          disabled={currentMessage === ''}
          loading={loading}
          icon={<ChevronRight />}
          variation="primary"
          onClick={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          Send
        </SubmitButton>
      </OptionsContainer>
    </MessagesPanelContainer>
  )
}
