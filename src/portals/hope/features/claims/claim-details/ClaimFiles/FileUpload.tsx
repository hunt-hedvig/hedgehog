import styled from '@emotion/styled'
import React from 'react'
import { FileEarmark, FileEarmarkArrowUpFill } from 'react-bootstrap-icons'
import Dropzone from 'react-dropzone'
import { toast } from 'react-hot-toast'

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
  justify-content: center;
  font-size: inherit;
  padding: 4rem;
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

export const FileUpload: React.FC<{
  claimId: string
  memberId: string
  onUpload: () => void
}> = ({ claimId, memberId, onUpload }) => {
  const handleDrop = (acceptedFiles: ReadonlyArray<File>) => {
    const claimFiles = new FormData()

    for (const file of acceptedFiles) {
      claimFiles.append('files', file)
    }
    claimFiles.append('memberId', memberId)

    toast.promise(
      fetch(`/api/claims/${claimId}/claimFiles`, {
        method: 'POST',
        body: claimFiles,
      }),
      {
        loading: 'Uploading file',
        success: () => {
          onUpload()
          return 'File uploaded'
        },
        error: 'Could not upload file',
      },
    )
  }

  return (
    <UploadClaimFileWrapper>
      <FileUploadContainer>
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
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
