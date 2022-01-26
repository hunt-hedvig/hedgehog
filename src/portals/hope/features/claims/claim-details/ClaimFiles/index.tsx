import styled from '@emotion/styled'
import {
  CardContent,
  CardTitle,
  Spinner,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { sleep } from '@hedvig-ui/utils/sleep'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { ClaimFileUpload, useClaimFilesQuery } from 'types/generated/graphql'
import { FileRow } from './FileRow'
import { FileUpload } from './FileUpload'
import gql from 'graphql-tag'

const TableWithOverflow = styled(Table)`
  overflow: visible !important;
`

const sortClaimFileDate = (a: ClaimFileUpload, b: ClaimFileUpload) => {
  const aDate = new Date(a.uploadedAt)
  const bDate = new Date(b.uploadedAt)

  return bDate.getTime() - aDate.getTime()
}

const NoClaimFiles = styled.div`
  padding: 1rem;
`

gql`
  query ClaimFiles($claimId: ID!) {
    claim(id: $claimId) {
      id
      claimFiles {
        claimFileId
      }
    }
  }
`

export const ClaimFileTable: React.FC<{
  claimId: string
  memberId: string
}> = ({ claimId, memberId }) => {
  const { data, error, loading, refetch } = useClaimFilesQuery({
    variables: { claimId },
  })

  const files = data?.claim?.claimFiles ?? []

  return (
    <CardContent>
      <CardTitle
        title="Files"
        badge={
          error
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
      {files.length !== 0 && (
        <TableWithOverflow>
          <TableHeader>
            <TableHeaderColumn>Claim Files</TableHeaderColumn>
            <TableHeaderColumn>File Type</TableHeaderColumn>
            <TableHeaderColumn>Uploaded At</TableHeaderColumn>
            <TableHeaderColumn />
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableColumn>
                  <Spinner />
                </TableColumn>
              </TableRow>
            )}

            {!files && !loading ? (
              <TableRow>
                <TableColumn>
                  <NoClaimFiles>
                    No claim documents have been uploaded for this claim
                  </NoClaimFiles>
                </TableColumn>
              </TableRow>
            ) : (
              files
                .slice()
                .sort(sortClaimFileDate)
                .map((claimFile) => (
                  <FileRow
                    key={claimId}
                    claimId={claimId}
                    claimFile={claimFile}
                    refetch={() => refetch()}
                  />
                ))
            )}
          </TableBody>
        </TableWithOverflow>
      )}
    </CardContent>
  )
}
