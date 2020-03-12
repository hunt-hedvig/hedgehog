import * as PropTypes from 'prop-types'
import * as React from 'react'

const AudioMessage = ({ content }) => <audio src={content} controls />

AudioMessage.propTypes = {
  content: PropTypes.string.isRequired,
}
