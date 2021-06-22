import styled from '@emotion/styled'
import React from 'react'
import { FileEarmark, FileEarmarkArrowUpFill } from 'react-bootstrap-icons'
import Dropzone from 'react-dropzone'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'

const UploadClaimFileWrapper = styled('div')`
  padding: 1rem 1rem;
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: 20rem;
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center,
  font-size: inherit;
  padding: 4rem;
  border: none;
  border-color: ${({ theme }) => theme.border};
  border-radius: 5px;
  color: ${({ theme }) => theme.semiStrongForeground};
  cursor: pointer;
  text-decoration: none;

  border: 2px dashed rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.03);
`

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
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '4.0em' }}>
                  {isDragActive ? <FileEarmarkArrowUpFill /> : <FileEarmark />}
                </div>
                <input {...getInputProps()} />
                Click here or drag files to upload
              </div>
            </Button>
          )}
        </Dropzone>
      </FileUploadContainer>
    </UploadClaimFileWrapper>
  )
}

export const FileUpload = withShowNotification(FileUploadComponent)
