import PropTypes from 'prop-types'
import React from 'react'
import styled from '@emotion/styled'

const Image = styled.img`
  margin-top: 5px;
  background-image: url(${(props) => props.src});
  height: 300px;
`

const ImageMessage = ({ content }) => {
  const { URL, imageUri, imageURL } = content
  const url = URL || imageUri || imageURL
  return url ? (
    <a target="_blank" href={url}>
      <Image src={url} />
    </a>
  ) : null
}

export default ImageMessage

ImageMessage.propTypes = {
  content: PropTypes.object.isRequired,
}
