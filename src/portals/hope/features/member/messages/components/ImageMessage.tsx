import styled from '@emotion/styled'
import React from 'react'

const Image = styled.img`
  margin-top: 5px;
  background-image: url(${(props) => props.src});
  height: 300px;
`

const ImageMessage: React.FC<{
  content: {
    URL?: string
    imageUri?: string
    imageURL?: string
  }
}> = ({ content }) => {
  const { URL, imageUri, imageURL } = content
  const url = URL || imageUri || imageURL

  return url ? (
    <a target="_blank" href={url}>
      <Image src={url} />
    </a>
  ) : null
}

export default ImageMessage
