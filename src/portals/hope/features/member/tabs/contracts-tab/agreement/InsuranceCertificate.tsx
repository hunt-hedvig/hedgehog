import { Button, ButtonsGroup, ThirdLevelHeadline } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import React from 'react'
import Dropzone from 'react-dropzone'
import { toast } from 'react-hot-toast'
import {
  GenericAgreement,
  useRegenerateCertificateMutation,
} from 'types/generated/graphql'

export const InsuranceCertificate: React.FC<{
  agreement: GenericAgreement
  onRefetch: () => void
}> = ({ agreement, onRefetch }) => {
  const [regenerateCertificate, { loading }] =
    useRegenerateCertificateMutation()

  const { confirm } = useConfirmDialog()

  const onUpload = (files: (string | Blob)[], agreementId: string) => {
    const certificateForm = new FormData()
    certificateForm.set('file', files[0])

    toast
      .promise(
        fetch(`/_/agreements/${agreementId}/certificates`, {
          method: 'POST',
          body: certificateForm,
        }),
        {
          loading: 'Uploading certificate',
          success: 'Certificate uploaded',
          error: 'Could not upload certificate',
        },
      )
      .then(() => onRefetch())
  }

  return (
    <>
      <ThirdLevelHeadline>Insurance Certificate</ThirdLevelHeadline>
      <ButtonsGroup>
        {agreement.certificateUrl && (
          <Button
            onClick={() => {
              if (!agreement.certificateUrl) {
                return
              }

              window.open(agreement.certificateUrl, '_blank')
            }}
          >
            View
          </Button>
        )}
        <Button
          disabled={loading}
          variant="secondary"
          onClick={() => {
            confirm(
              'Are you sure you want to regenerate the certificate?',
            ).then(() => {
              toast.promise(
                regenerateCertificate({
                  variables: {
                    agreementId: agreement.id,
                  },
                }),
                {
                  loading: 'Regenerating certificate',
                  success: 'Certificate generated',
                  error: 'Could not regenerate certificate',
                },
              )
            })
          }}
        >
          Regenerate
        </Button>
        <Dropzone onDrop={(files) => onUpload(files, agreement.id)}>
          {({ getRootProps, getInputProps }) => {
            const { ref, ...props } = getRootProps()

            return (
              <Button variant="secondary" {...props}>
                <input {...getInputProps()} />
                Upload New
              </Button>
            )
          }}
        </Dropzone>
      </ButtonsGroup>
    </>
  )
}
