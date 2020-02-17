import { NUMBER, TEXT } from 'lib/messageTypes'
import PropTypes from 'prop-types'
import React from 'react'
import { Form, Input } from 'semantic-ui-react'

const NumberInput = ({ changeHandler }) => (
  <React.Fragment>
    <Form.Field>
      <label>Text</label>
      <Input fluid onChange={changeHandler.bind(this, TEXT)} />
    </Form.Field>
    <Form.Field>
      <label>Nubmer</label>
      <Input fluid type="number" onChange={changeHandler.bind(this, NUMBER)} />
    </Form.Field>
  </React.Fragment>
)

export default NumberInput

NumberInput.propTypes = {
  changeHandler: PropTypes.func.isRequired,
}
