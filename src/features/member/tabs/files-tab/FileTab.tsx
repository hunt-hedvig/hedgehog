import styled from '@emotion/styled'
import {
  LoadingMessage,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { dateTimeFormatter } from '@hedvig-ui/utils/date'
import { FocusItems, useFocus } from 'features/navigation/hooks/use-navigation'
import React from 'react'
import { FileUpload, useFileUploadsQueryQuery } from 'types/generated/graphql'

const sortFileDate = (a, b) => {
  const aDate = new Date(a.timestamp)
  const bDate = new Date(b.timestamp)

  return ((bDate as any) as number) - ((aDate as any) as number)
}

const Image = styled.img`
  width: 300px;
`

const MemberFileTable: React.FC<{
  memberFiles: FileUpload[]
}> = ({ memberFiles }) => (
  <Table>
    <TableHeader>
      <TableHeaderColumn>Member File</TableHeaderColumn>
      <TableHeaderColumn>Time Stamp</TableHeaderColumn>
      <TableHeaderColumn>File Type</TableHeaderColumn>
    </TableHeader>
    <TableBody>
      {[...memberFiles].sort(sortFileDate).map((memberFile) => (
        <TableRow border key={memberFile.fileUploadUrl}>
          <TableColumn>
            <Image src={memberFile.fileUploadUrl} />
          </TableColumn>
          <TableColumn>
            {dateTimeFormatter(memberFile.timestamp, 'yyyy-MM-dd HH:mm:ss')}
          </TableColumn>
          <TableColumn>{memberFile.mimeType}</TableColumn>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export const MemberFile: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const { data, loading, error } = useFileUploadsQueryQuery({
    variables: { memberId },
  })

  useFocus(FocusItems.Member.items.Files)

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
