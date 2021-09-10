import {
  Button,
  ButtonLink,
  ButtonsGroup,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import {
  regenerateCertificateOptions,
  useRegenerateCertificate,
} from 'graphql/use-regenerate-certificate'
import React from 'react'
import Dropzone from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { Contract, GenericAgreement } from 'types/generated/graphql'

export const InsuranceCertificate: React.FC<{
  contract: Contract
  agreement: GenericAgreement
  refetch: () => Promise<void>
}> = ({ contract, agreement, refetch }) => {
  const [regenerateCertificate, { loading }] = useRegenerateCertificate(
    contract,
  )

  const onUpload = (files, agreementId) => {
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
            View
          </ButtonLink>
        )}
        <Button
          disabled={loading}
          variation="third"
          fullWidth
          onClick={() => {
            if (
              !window.confirm(
                'Are you sure you want to regenerate the certificate?',
              )
            ) {
              return
            }

            toast.promise(
              regenerateCertificate(regenerateCertificateOptions(agreement.id)),
              {
                loading: 'Regenerating certificate',
                success: 'Certificate generated',
                error: 'Could not regenerate certificate',
              },
            )
          }}
        >
          Regenerate
        </Button>
        <Dropzone onDrop={(files) => onUpload(files, agreement.id)}>
          {({ getRootProps, getInputProps }) => (
            <Button
              fullWidth={!!agreement.certificateUrl}
              halfWidth={!agreement.certificateUrl}
              variation="third"
              {...(getRootProps() as any)}
            >
              <input {...getInputProps()} />
              Upload New
            </Button>
          )}
        </Dropzone>
      </ButtonsGroup>
    </>
  )
}
