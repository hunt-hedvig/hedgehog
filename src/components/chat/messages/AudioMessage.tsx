import * as React from 'react';
import * as PropTypes from 'prop-types';

const AudioMessage = ({ content }) => <audio src={content} controls />;

AudioMessage.propTypes = {
    content: PropTypes.string.isRequired
};
