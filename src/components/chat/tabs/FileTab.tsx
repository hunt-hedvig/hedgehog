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

//   const handleClick = () => {
//     console.log("hey");
//   }

const TableExampleCelled = ( { memberFiles } ) => (
    <Table celled>
    <Table.Header>
        <Table.Row>
        <Table.HeaderCell>{console.log(memberFiles)} </Table.HeaderCell>
        <Table.HeaderCell>Time Stamp</Table.HeaderCell>
        </Table.Row>
    </Table.Header>

    <Table.Body>
        {console.log(memberFiles)}
        {memberFiles.length === 0 
        ? "No Files uploaded for this member yet" 
        : memberFiles.sort(fileDateSorter).map((memberFile) => (
        <Table.Row>
            {/* { console.log(memberFile.fileUploadUrl.state )} */}
            <Table.Cell>
            {/* <Table.Cell className={ memberFile.fileUploadUrl.state.clicked ? "clicked" : "" } onClick={ this.handleClick }> */}
                {/* <Image src={ memberFile.fileUploadUrl } target="_blank" />  */}
                <Image src={ memberFile.fileUploadUrl } size="medium" /> 
            </Table.Cell>
            <Table.Cell>
                { memberFile.timestamp }
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


    fileSelectedHandler = event => {
        console.log(event);
    }

    public render() {
        return (
            <Query query={query} variables={ this.variables }>
                {({ loading, error, data }) => {
                    if (error) {
                    return <div>Error in GraphQl query here..... { console.log(data) }: <pre>{JSON.stringify(error, null, 2)}</pre></div>
                    }
                    if (loading || !data) {
                    return <div>Loading...</div>
                    }

                    return ( 
                        <TableExampleCelled
                            memberFiles={ data.member.fileUploads } 
                    /> 
                        // return <div className="App">
                        //     <input type="file" onChange={this.fileSelectedHandler} />
                        // </div>
                    )
                }}
            </Query>

        )
    }
}

export default MemberFile 


