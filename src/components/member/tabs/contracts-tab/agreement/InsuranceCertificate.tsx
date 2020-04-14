import { Agreement, Contract } from 'api/generated/graphql'
import { Button, ButtonLink, ButtonsGroup } from 'hedvig-ui/button'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import Dropzone from 'react-dropzone'
import { Notification } from 'store/actions/notificationsActions'

export const InsuranceCertificate: React.FunctionComponent<{
  contract: Contract
  agreement: Agreement
  showNotification: (data: Notification) => void
  refetch: () => Promise<void>
}> = ({ contract, agreement, showNotification, refetch }) => {
  const onUpload = (files, memberId) => {
    const certificateForm = new FormData()
    certificateForm.set('file', files[0])

    fetch(`/api/member/insurance/${memberId}/certificate`, {
      method: 'POST',
      body: certificateForm,
    })
      .then(() => {
        showNotification({
          type: 'olive',
          header: 'Success',
          message: 'Successfully uploaded certificate.',
        })
      })
      .catch((error) => {
        showNotification({
          type: 'red',
          header: 'Unable to upload certificate',
          message: error.message,
        })
        throw error
      })
      .then(() => refetch())
  }

  return (
    <>
      <ThirdLevelHeadline>Insurance Certificate</ThirdLevelHeadline>
      <ButtonsGroup>
        {agreement.certificateUrl && (
          <ButtonLink
            variation={'primary'}
            fullWidth
            target="_blank"
            href={agreement.certificateUrl!!}
          >
            View Existing
          </ButtonLink>
        )}
        <Dropzone onDrop={(files) => onUpload(files, contract.holderMemberId)}>
          {({ getRootProps, getInputProps }) => (
            // @ts-ignore
            <Button
              fullWidth={!!agreement.certificateUrl}
              halfWidth={!agreement.certificateUrl}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              Upload
            </Button>
          )}
        </Dropzone>
      </ButtonsGroup>
    </>
  )
}
