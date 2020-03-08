import * as React from 'react'
import styled from 'react-emotion'
import { Form, TextArea as SemanticTextArea } from 'semantic-ui-react'

const StyledForm = styled(Form)({
  marginTop: '1rem',
  width: '100%',
})

export const TextArea: React.FunctionComponent<{
  placeholder: string
  setText: (value: string) => void
}> = ({ placeholder, setText }) => {
  return (
    <StyledForm>
      <SemanticTextArea
        autoHeight
        placeholder={placeholder}
        onChange={(_, { value }) => setText(value as string)}
      />
    </StyledForm>
  )
}
