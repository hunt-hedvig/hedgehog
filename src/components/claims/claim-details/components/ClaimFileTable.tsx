import styled from '@emotion/styled'
import {
  ClaimFileUpload,
  useClaimFilesQuery,
  useSetClaimFileCategoryMutation,
} from 'api/generated/graphql'
import { Spinner } from 'hedvig-ui/sipnner'
import { ErrorText } from 'hedvig-ui/typography'
import { dateTimeFormatter } from 'lib/helpers'
import React from 'react'
import { Dropdown, Image, Table } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'
import { sleep } from 'utils/sleep'
import { DeleteButton } from './DeleteClaimFileButton'
import { FileUpload } from './FileUpload'

const TableWithOverflow = styled(Table)`
  overflow: visible !important;
`

const sortClaimFileDate = (a: ClaimFileUpload, b: ClaimFileUpload) => {
  const aDate = new Date(a.uploadedAt)
  const bDate = new Date(b.uploadedAt)

  return ((bDate as any) as number) - ((aDate as any) as number)
}

const NoClaimFiles = styled('div')({
  padding: '1rem',
})

const fileUploadOptions = [
  {
    key: 'Reciept',
    text: 'Reciept',
    value: 'Reciept',
  },
  {
    key: 'Proof of ownership',
    text: 'Proof of ownership',
    value: 'Proof of ownership',
  },
  {
    key: 'Police report',
    text: 'Police report',
    value: 'Police report',
  },
  {
    key: 'Invoice',
    text: 'Invoice',
    value: 'Invoice',
  },
  {
    key: 'Proof of damage',
    text: 'Proof of damage',
    value: 'Proof of damage',
  },
  {
    key: 'Other',
    text: 'Other',
    value: 'Other',
  },
]

const ClaimFileTableComponent: React.FC<WithShowNotification & {
  claimId: string
  memberId: string
}> = ({ claimId, memberId, showNotification }) => {
  const {
    data: claimFilesData,
    refetch,
    loading,
    error: queryError,
  } = useClaimFilesQuery({
    variables: { claimId },
  })
  const [setClaimFileCategory] = useSetClaimFileCategoryMutation()

  const claimFiles = claimFilesData?.claim?.claimFiles ?? []

  return (
    <>
      <FileUpload
        claimId={claimId}
        memberId={memberId}
        onUpload={async () => {
          await sleep(500)
          await refetch()
        }}
      />

      {queryError && <ErrorText>{queryError.message}</ErrorText>}

      <TableWithOverflow celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Claim Files</Table.HeaderCell>
            <Table.HeaderCell>File Type</Table.HeaderCell>
            <Table.HeaderCell>Uploaded At</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading && (
            <Table.Row>
              <Table.Cell>
                <Spinner />
              </Table.Cell>
            </Table.Row>
          )}

          {!claimFiles && !loading ? (
            <Table.Row>
              <Table.Cell>
                <NoClaimFiles>
                  No claim documents have been uploaded for this claim
                </NoClaimFiles>
              </Table.Cell>
            </Table.Row>
          ) : (
            claimFiles.sort(sortClaimFileDate).map((claimFile) => {
              return (
                <Table.Row key={claimFile.claimFileId}>
                  <Table.Cell>
                    {claimFile.contentType === 'application/pdf' ? (
                      <embed
                        src={claimFile.fileUploadUrl}
                        width="800px"
                        height="300px"
                      />
                    ) : (
                      <Image src={claimFile.fileUploadUrl} size="large" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      placeholder={
                        claimFile.category !== null
                          ? claimFile.category
                          : 'File Type'
                      }
                      fluid
                      selection
                      options={fileUploadOptions}
                      onChange={(event) =>
                        setClaimFileCategory({
                          variables: {
                            claimId,
                            claimFileId: claimFile.claimFileId!,
                            category: event.currentTarget.textContent,
                          },
                        })
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {dateTimeFormatter(
                      claimFile.uploadedAt,
                      'yyyy-MM-dd HH:mm:ss',
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <DeleteButton
                      claimId={claimId}
                      claimFileId={claimFile.claimFileId!}
                      showNotification={showNotification}
                      onDeleted={async () => {
                        await sleep(500)
                        await refetch()
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              )
            })
          )}
        </Table.Body>
      </TableWithOverflow>
    </>
  )
}

export const ClaimFileTable = withShowNotification(ClaimFileTableComponent)
