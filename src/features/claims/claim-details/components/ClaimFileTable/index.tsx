import styled from '@emotion/styled'
import {
  CardContent,
  CardTitle,
  Spinner,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
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
        <TableWithOverflow>
          <TableHeader>
            <TableHeaderColumn>Claim Files</TableHeaderColumn>
            <TableHeaderColumn>File Type</TableHeaderColumn>
            <TableHeaderColumn>Uploaded At</TableHeaderColumn>
            <TableHeaderColumn />
          </TableHeader>

          {loading && (
            <TableRow>
              <TableColumn>
                <Spinner />
              </TableColumn>
            </TableRow>
          )}

          {!claimFiles && !loading ? (
            <TableRow>
              <TableColumn>
                <NoClaimFiles>
                  No claim documents have been uploaded for this claim
                </NoClaimFiles>
              </TableColumn>
            </TableRow>
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
        </TableWithOverflow>
      )}
    </CardContent>
  )
}
