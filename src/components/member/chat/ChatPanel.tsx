import styled from '@emotion/styled'
import {
  FormControlLabel as MuiFormControlLabel,
  Switch as MuiSwitch,
  TextField as MuiTextField,
} from '@material-ui/core'
import { getSendMessageOptions, useSendMessage } from 'graphql/use-send-message'
import { Button } from 'hedvig-ui/button'
import React, { useState } from 'react'
import { ChevronRight } from 'react-bootstrap-icons'
import { shouldIgnoreInput } from 'utils/hooks/key-press-hook'

const MessagesPanelContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: wrap;
  margin-top: auto;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.backgroundLight};
  border-top: 0;
`

const ChatForm = styled.form`
  margin: 0 1rem;
  width: 100%;
`
const OptionsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const OptionCheckbox = styled(MuiSwitch)`
  vertical-align: middle;
`

const SubmitButton = styled(Button)`
  margin: 1rem;
`

const TextField = styled(MuiTextField)`
  width: 100%;
  box-sizing: border-box;
`

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
    if (shouldIgnoreInput(e.currentTarget.value)) {
      return
    }
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
            if (shouldIgnoreInput(event.key)) {
              event.preventDefault()
              return
            }
            if (shouldSubmit(event)) {
              event.preventDefault()
              handleSubmit()
            }
          }}
        />
      </ChatForm>

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
