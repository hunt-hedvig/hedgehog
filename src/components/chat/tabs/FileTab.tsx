import gql from 'graphql-tag'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Table, Image } from 'semantic-ui-react'
import { dateTimeFormatter } from '../../../lib/helpers'

const query = gql`
  query FileUploadsQuery($memberId: ID!) {
    member(id: $memberId) {
      fileUploads {
        fileUploadUrl
        memberId
        timestamp
        mimeType
      }
    }
  }
`
const sortFileDate = (a, b) => {
  const aDate = new Date(a.timestamp)
  const bDate = new Date(b.timestamp)

  return bDate - aDate
}

interface FileUpload {
  fileUploadUrl: string
  memberId: string
  timestamp: string
  mimeType: string
}

interface MemberFileTableProps {
  memberFiles: Array<FileUpload>
}

const MemberFileTable: React.FunctionComponent<MemberFileTableProps> = ({ memberFiles }) => (
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
          <Table.Cell>{dateTimeFormatter(memberFile.timestamp, 'yyyy-MM-dd HH:mm:ss')}</Table.Cell>
          <Table.Cell>{memberFile.mimeType}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)

class MemberFile extends React.Component {
  public render() {
    return (
      <Query query={query} variables={{ memberId: this.props.match.params.id }}>
        {({ loading, error, data }) => {
          if (error) {
            return (
              <div>
                Error in GraphQl query here.....:{' '}
                <pre>{JSON.stringify(error, null, 2)}</pre>
              </div>
            )
          }
          if (loading || !data) {
            return <div>Loading...</div>
          }

          return data.member.fileUploads.length === 0 ? (
            <div>No files uploaded for this member</div>
          ) : (
            <MemberFileTable memberFiles={data.member.fileUploads} />
          )
        }}
      </Query>
    )
  }
}

export default MemberFile
