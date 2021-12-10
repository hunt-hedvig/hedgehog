import styled from '@emotion/styled'
import { useElementFocus } from '@hedvig-ui/hooks/use-element-focus'
import React, { useRef } from 'react'
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
  border-color: ${({ theme }) => theme.border};
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
  focus?: boolean
}> = ({ claimId, memberId, onUpload, focus }) => {
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

  const inputRef = useRef<HTMLInputElement>(null)

  useElementFocus(inputRef, focus)

  return (
    <UploadClaimFileWrapper>
      <FileUploadContainer>
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            // @ts-ignore
            <Button {...getRootProps()} ref={inputRef}>
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
