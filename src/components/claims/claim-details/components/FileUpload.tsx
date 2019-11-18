import * as React from 'react'
import styled from 'react-emotion'
import { colors } from '@hedviginsurance/brand'
import Dropzone from 'react-dropzone'
import actions from 'store/actions'
import { connect } from 'react-redux'

const UploadClaimFileWrapper = styled('div')({
  padding: '4rem',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  border: '1px solid rgba(0,0,0,0.08)',
  minHeight: '20rem',
})

const UploadClaimFileHeader = styled('h3')({})

export const Button = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'inherit',
  font: 'inherit',
  padding: '2rem 2rem',
  border: '1px solid ',
  borderRadius: '0.2',
  color: colors.BLACK,
  background: colors.WHITE,
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover, &:focus': {
    color: colors.GREEN,
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

class FileUploadComponent extends React.Component<{
  claimId: string
  memberId: string
  showNotification: (data: any) => void
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
            <Dropzone
              onDrop={(files) => {
                this.onDrop(files, this.props.showNotification)
              }}
            >
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

  private onDrop = (acceptedFiles, showNotification) => {
    this.onChangeHandler(acceptedFiles)
    this.uploadFiles(acceptedFiles, showNotification)
  }

  private uploadFiles(files, showNotification): any {
    var claimFiles = new FormData()

    for (const file of files) {
      claimFiles.append('files', file)
    }
    claimFiles.append('memberId', this.props.memberId)

    fetch(`/api/claims/${this.props.claimId}/claimFiles`, {
      method: 'POST',
      body: claimFiles,
    })
      .then(() => {
        showNotification({
          message: 'upload successful!',
          header: 'Approved',
          type: 'olive',
        })
      })
      .catch((error) => {
        showNotification({
          message: error.message,
          header: 'Error',
          type: 'red',
        })
        throw error
      })
  }
}

const mapActions = { ...actions.notificationsActions }

export const FileUpload = connect(
  null,
  mapActions,
)(FileUploadComponent)
