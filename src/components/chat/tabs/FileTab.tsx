import gql from "graphql-tag";
import React from "react";
import { Query } from "react-apollo";
import { Table, Image } from 'semantic-ui-react'

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
const fileDateSorter = (a, b) => {
    const aDate = new Date(a.timestamp)
    const bDate = new Date(b.timestamp)
  
    if (aDate > bDate) {
      return -1
    }
    if (bDate > aDate) {
      return 1
    }
    return 0
}

const TableExampleCelled = ( { memberFiles } ) => (
    <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Member File</Table.HeaderCell>
                <Table.HeaderCell>Time Stamp</Table.HeaderCell>
                <Table.HeaderCell>File Type</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            { memberFiles.length === 0 
            ? "No files uploaded for this member yet" 
            : memberFiles.sort(fileDateSorter).map((memberFile) => (
                <Table.Row>
                    <Table.Cell>
                        <Image src={ memberFile.fileUploadUrl } size="medium" />
                    </Table.Cell>
                    <Table.Cell>
                        { memberFile.timestamp }
                    </Table.Cell>
                    <Table.Cell>
                        {  memberFile.mimeType }
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
)

class MemberFile extends React.Component {
    constructor(props) {
        super(props)
        this.state = { clicked: false }
        this.variables = {
            memberId: props.match.params.id
        }
    }

    public render() {
        return (
            <Query query={query} variables={ this.variables }>
                {({ loading, error, data }) => {
                    if (error) {
                        return <div>Error in GraphQl query here.....: <pre>{JSON.stringify(error, null, 2)}</pre></div>
                    }
                    if (loading || !data) {
                        return <div>Loading...</div>
                    }

                    return ( 
                        <TableExampleCelled
                            memberFiles={ data.member.fileUploads } 
                        /> 
                    )
                }}
            </Query>

        )
    }
}

export default MemberFile 