import PropTypes from 'prop-types'
import React from 'react'

const AudioMessage = ({ content }) => <audio src={content} controls />

AudioMessage.propTypes = {
  content: PropTypes.string.isRequired,
}
