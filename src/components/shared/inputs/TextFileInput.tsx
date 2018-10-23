import * as PropTypes from 'prop-types'
import * as React from 'react'
import FileInput from './FileInput'
import TextInput from './TextInput'

const TextFileInput = ({ changeHandler, type, cleanupForm }) => (
  <React.Fragment>
    <TextInput changeHandler={changeHandler} cleanupForm={cleanupForm} label />
    <FileInput
      changeHandler={changeHandler}
      type={type}
      cleanupForm={cleanupForm}
    />
  </React.Fragment>
)

export default TextFileInput

TextFileInput.propTypes = {
  changeHandler: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  cleanupForm: PropTypes.bool,
}
