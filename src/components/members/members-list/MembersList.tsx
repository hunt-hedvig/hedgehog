import { LinkRow } from 'components/shared'
import PaginatorList from 'components/shared/paginator-list/PaginatorList'
import * as sockets from 'lib/sockets'
import * as moment from 'moment'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Table } from 'semantic-ui-react'
import { history } from 'store'

export default class MembersList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null,
      subscription: null,
      column: null,
      direction: null,
    }
  }

  public getMemberName = (member) =>
    member.firstName
      ? `${member.firstName} ${member.lastName || ''}`
      : `Member-${member.memberId}`

  public linkClickHandler = (id) => history.push(`/members/${id}`)

  public getTableRow = (item) => {
    const signedOn = moment(item.signedOn).local()
    const formattedsignedOn = signedOn.isValid()
      ? signedOn.format('DD MMMM YYYY HH:mm')
      : '-'

    const createdOn = moment(item.createdOn).local()
    const formattedCreatedOn = createdOn.isValid()
      ? createdOn.format('DD MMMM YYYY HH:mm')
      : '-'

    return (
      <LinkRow onClick={this.linkClickHandler.bind(this, item.memberId)}>
        <Table.Cell>{this.getMemberName(item)}</Table.Cell>
        <Table.Cell>{formattedCreatedOn}</Table.Cell>
        <Table.Cell>{formattedsignedOn}</Table.Cell>
      </LinkRow>
    )
  }

  public sortTable = (clickedColumn) => {
    const { column, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        direction: 'ascending',
      })
      this.props.sortMembersList(clickedColumn, false)
      return
    }

    this.setState(
      {
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      },
      () => {
        this.props.sortMembersList(
          clickedColumn,
          this.state.direction === 'descending',
        )
      },
    )
  }

  public getTableHeader = () => {
    const { column, direction } = this.state
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            sorted={column === 'name' ? direction : null}
            onClick={this.sortTable.bind(this, 'name')}
          >
            Name
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={column === 'createdOn' ? direction : null}
            onClick={this.sortTable.bind(this, 'createdOn')}
          >
            Created
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={column === 'signedOn' ? direction : null}
            onClick={this.sortTable.bind(this, 'signedOn')}
          >
            Sign up
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    )
  }

  public subscribeSocket = (connection) => {
    const {
      newMessagesReceived,
      client: { name },
    } = this.props
    const { stompClient, subscription } = sockets.membersListSubscribe(
      { newMessagesReceived },
      name,
      connection,
    )
    this.setState({
      socket: stompClient,
      subscription,
    })
  }

  public componentDidMount() {
    // TODO uncomment when ready method to count the number of unread messages
    /* const { setActiveConnection, messages } = this.props;
        if (!messages.activeConnection) {
            sockets.connect().then(stompClient => {
                setActiveConnection(stompClient);
                this.subscribeSocket(stompClient);
            });
        } else {
            this.subscribeSocket(messages.activeConnection);
        } */
  }

  public render() {
    const {
      members: { list },
    } = this.props
    return (
      <PaginatorList
        list={list}
        itemContent={(item) => this.getTableRow(item)}
        tableHeader={this.getTableHeader()}
        pageSize={25}
        isSortable={true}
        keyName="memberId"
      />
    )
  }
}

MembersList.propTypes = {
  members: PropTypes.object.isRequired,
  newMessagesReceived: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  sortMembersList: PropTypes.func.isRequired,
}
