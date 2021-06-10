import styled from '@emotion/styled'
import React from 'react'
import Dropzone from 'react-dropzone'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'

const UploadClaimFileWrapper = styled('div')({
  padding: '4rem',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(0,0,0,0.08)',
  minHeight: '20rem',
})

export const Button = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'inherit',
  font: 'inherit',
  padding: '4rem',
  border: '1px solid',
  borderColor: theme.border,
  borderRadius: '5px',
  color: theme.foreground,
  background: theme.backgroundTransparent,
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover, &:focus': {
    color: theme.accent,
    textDecoration: 'none',
  },
  '&:focus, &:hover': {
    outline: 'none',
    boxShadow: 'none',
  },
}))

const FileUploadContainer = styled('div')({
  padding: '2rem',
})

const FileUploadComponent: React.FC<WithShowNotification & {
  claimId: string
  memberId: string
  onUpload: () => void
}> = ({ claimId, memberId, onUpload, showNotification }) => {
  const handleDrop = (acceptedFiles: ReadonlyArray<File>) => {
    const claimFiles = new FormData()

    for (const file of acceptedFiles) {
      claimFiles.append('files', file)
    }
    claimFiles.append('memberId', memberId)

    fetch(`/api/claims/${claimId}/claimFiles`, {
      method: 'POST',
      body: claimFiles,
    })
      .then(() => {
        showNotification({
          message: 'Upload successful!',
          header: 'Approved',
          type: 'olive',
        })
        onUpload()
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

  return (
    <UploadClaimFileWrapper>
      <FileUploadContainer>
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            // @ts-ignore
            <Button {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive
                ? 'Drop files here to upload them'
                : 'Click here or drag files to upload'}
            </Button>
          )}
        </Dropzone>
      </FileUploadContainer>
    </UploadClaimFileWrapper>
  )
}

export const FileUpload = withShowNotification(FileUploadComponent)
