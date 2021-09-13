import styled from '@emotion/styled'
import { CardContent, CardTitle, Spinner } from '@hedvig-ui'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { Dropdown, Image, Table } from 'semantic-ui-react'
import {
  ClaimFileUpload,
  useClaimPageQuery,
  useSetClaimFileCategoryMutation,
} from 'types/generated/graphql'
import { dateTimeFormatter } from 'utils/helpers'
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

export const ClaimFileTable: React.FC<{
  claimId: string
  memberId: string
}> = ({ claimId, memberId }) => {
  const {
    data: claimFilesData,
    refetch,
    loading,
    error: queryError,
  } = useClaimPageQuery({
    variables: { claimId },
  })
  const [setClaimFileCategory] = useSetClaimFileCategoryMutation()

  const claimFiles = claimFilesData?.claim?.claimFiles ?? []

  return (
    <CardContent>
      <CardTitle
        title={'Files'}
        badge={
          queryError
            ? {
                icon: BugFill,
                status: 'danger',
                label: 'Internal Error',
              }
            : null
        }
      />
      <FileUpload
        claimId={claimId}
        memberId={memberId}
        onUpload={async () => {
          await sleep(500)
          await refetch()
        }}
      />
      {claimFiles.length !== 0 && (
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
      )}
    </CardContent>
  )
}
