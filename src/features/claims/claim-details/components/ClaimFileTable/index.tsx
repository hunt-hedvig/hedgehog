import styled from '@emotion/styled'
import { CardContent, CardTitle, Spinner } from '@hedvig-ui'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { Table } from 'semantic-ui-react'
import { ClaimFileUpload, useClaimPageQuery } from 'types/generated/graphql'
import { sleep } from 'utils/sleep'
import { FileUpload } from '../FileUpload'
import { FileRow } from './FileRow'

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

export const ClaimFileTable: React.FC<{
  claimId: string
  memberId: string
  focus: boolean
}> = ({ claimId, memberId, focus }) => {
  const {
    data: claimFilesData,
    refetch,
    loading,
    error: queryError,
  } = useClaimPageQuery({
    variables: { claimId },
  })

  const claimFiles = claimFilesData?.claim?.claimFiles ?? []

  return (
    <CardContent>
      <CardTitle
        title="Files"
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
        focus={focus}
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
              [...claimFiles]
                .sort(sortClaimFileDate)
                .map((claimFile) => (
                  <FileRow
                    claimId={claimId}
                    claimFile={claimFile}
                    refetch={refetch}
                  />
                ))
            )}
          </Table.Body>
        </TableWithOverflow>
      )}
    </CardContent>
  )
}
