import * as React from 'react'
import styled from 'react-emotion'
import { colors } from '@hedviginsurance/brand'
import Dropzone from 'react-dropzone'

const UploadClaimFileWrapper = styled('div')({
  alignItems: 'center',
  backgroundColor: colors.LIGHT_GRAY,
  justifyContent: 'center',
})

const UploadClaimFileHeader = styled('h3')({
  alignItems: 'center',
  justifyContent: 'center',
})

export const Button = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'inherit',
  font: 'inherit',
  padding: '.5rem 2rem',
  border: '1px solid ',
  color: colors.BLACK,
  background: colors.WHITE,
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover, &:focus': {
    color: colors.BLACK_PURPLE,
    textDecoration: 'none',
  },
  '&:focus, &:hover': {
    outline: 'none',
    boxShadow: 'none',
  },
})

const FileUploadContainer = styled('div')({
  padding: '2rem 2rem',
})

class FileUpload extends React.Component<{
  claimId: string
  memberId: string
}> {
  state = {
    value: null,
  }

  render() {
    return (
      <>
        <UploadClaimFileWrapper>
          <UploadClaimFileHeader>Upload files here</UploadClaimFileHeader>
          <FileUploadContainer>
            <Dropzone onDrop={this.onDrop} multiple>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <Button {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive
                    ? 'Drop files here!'
                    : 'Click here or drag files to upload!'}
                </Button>
              )}
            </Dropzone>
          </FileUploadContainer>
        </UploadClaimFileWrapper>
      </>
    )
  }

  private onChangeHandler = (acceptedFiles) => {
    this.setState({
      value: acceptedFiles,
    })
  }

  private onDrop = (acceptedFiles) => {
    this.onChangeHandler(acceptedFiles)
    this.uploadFiles(acceptedFiles)
  }

  private uploadFiles(files): any {
    var claimFiles = new FormData()

    for (const file of files) {
      claimFiles.append('files', file)
    }
    claimFiles.append('memberId', this.props.memberId)

    fetch(`/api/claims/${this.props.claimId}/claimFiles`, {
      method: 'POST',
      body: claimFiles,
    })
      .then((response) => response.json())
      .then((success) => {
        console.log('success')
      })
      .catch((error) => console.log(error))
  }
}

export { FileUpload }
