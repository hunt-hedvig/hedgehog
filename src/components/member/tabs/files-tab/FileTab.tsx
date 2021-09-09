import { LoadingMessage, StandaloneMessage } from '@hedvig-ui'
import { FileUpload, useFileUploadsQueryQuery } from 'api/generated/graphql'
import React from 'react'
import { Image, Table } from 'semantic-ui-react'
import { dateTimeFormatter } from 'utils/helpers'

const sortFileDate = (a, b) => {
  const aDate = new Date(a.timestamp)
  const bDate = new Date(b.timestamp)

  return ((bDate as any) as number) - ((aDate as any) as number)
}

const MemberFileTable: React.FC<{
  memberFiles: FileUpload[]
}> = ({ memberFiles }) => (
  <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Member File</Table.HeaderCell>
        <Table.HeaderCell>Time Stamp</Table.HeaderCell>
        <Table.HeaderCell>File Type</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {[...memberFiles].sort(sortFileDate).map((memberFile) => (
        <Table.Row key={memberFile.fileUploadUrl}>
          <Table.Cell>
            <Image src={memberFile.fileUploadUrl} size="medium" />
          </Table.Cell>
          <Table.Cell>
            {dateTimeFormatter(memberFile.timestamp, 'yyyy-MM-dd HH:mm:ss')}
          </Table.Cell>
          <Table.Cell>{memberFile.mimeType}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)

export const MemberFile: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const { data, loading, error } = useFileUploadsQueryQuery({
    variables: { memberId },
  })
  if (error) {
    return (
      <div>
        Error in GraphQl query here.....:{' '}
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }
  if (loading || !data?.member) {
    return <LoadingMessage paddingTop="10vh" />
  }

  return data.member?.fileUploads.length === 0 ? (
    <StandaloneMessage paddingTop="10vh">
      No files uploaded for this member
    </StandaloneMessage>
  ) : (
    <MemberFileTable memberFiles={data.member!.fileUploads} />
  )
}
