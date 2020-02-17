import { TEXT } from 'lib/messageTypes'
import PropTypes from 'prop-types'
import React from 'react'
import { Form, TextArea } from 'semantic-ui-react'

export default class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      textValue: '',
    }
  }

  textChangeHandler = (e, { value }) => {
    this.setState({ textValue: value })
    this.props.changeHandler(TEXT, null, { value })
  }

  componentWillMount() {
    this.setState({ textValue: this.props.value || '' })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cleanupForm) {
      this.setState({ textValue: '' })
    }
  }

  render() {
    return (
      <Form.Field>
        {this.props.label ? <label>Text</label> : null}
        <TextArea
          autoHeight
          onChange={this.textChangeHandler}
          value={this.state.textValue}
          disabled={this.props.disabled}
        />
      </Form.Field>
    )
  }
}

TextInput.propTypes = {
  changeHandler: PropTypes.func.isRequired,
  cleanupForm: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  label: PropTypes.bool,
}
