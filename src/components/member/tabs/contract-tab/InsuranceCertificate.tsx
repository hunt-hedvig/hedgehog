import React from 'react'
import Dropzone from 'react-dropzone'
import { Button, ButtonLink } from '../../../../../shared/hedvig-ui/button'
import { Card } from '../../../../../shared/hedvig-ui/card'
import { Agreement, Contract } from '../../../../api/generated/graphql'
// import { WithShowNotification } from "../../../../store/actions/notificationsActions";

const InsuranceCertificateComponent: React.FunctionComponent<{
  contract: Contract
  agreement: Agreement
  showNotification: (data: any) => void
  onUploaded: () => void
}> = ({ contract, agreement, showNotification, onUploaded }) => {
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
        onUploaded()
      })
      .catch((error) => {
        showNotification({
          type: 'red',
          header: 'Unable to upload certificate',
          message: error.message,
        })
        throw error
      })
  }

  return (
    <Card span={2}>
      Insurance certificate
      <ButtonLink target="_blank" href={agreement.certificateUrl}>
        View existing
      </ButtonLink>
      <Dropzone onDrop={(files) => onUpload(files, contract.holderMemberId)}>
        {({ getRootProps, getInputProps }) => (
          <Button {...getRootProps()}>
            <input {...getInputProps()} />
            Upload new
          </Button>
        )}
      </Dropzone>
    </Card>
  )
}

export const InsuranceCertificate = InsuranceCertificateComponent
