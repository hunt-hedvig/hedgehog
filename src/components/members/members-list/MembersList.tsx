import { LinkRow } from 'components/shared'
import * as sockets from 'lib/sockets'
import * as moment from 'moment'
import * as React from 'react'
import { Table } from 'semantic-ui-react'
import { history } from 'store'
import {
  Member,
  MemberSearchFilter,
  MembersSortBy,
  MembersStore,
} from '../../../store/storeTypes'
import BackendPaginatorList from '../../shared/paginator-list/BackendPaginatorList'

export interface MembersListProps {
  members: MembersStore
  searchMemberRequest: (q: MemberSearchFilter) => void
}

export default class MembersList extends React.Component<MembersListProps, {}> {
  constructor(props: MembersListProps) {
    super(props)
  }

  public getMemberName = (member: Member) =>
    member.firstName
      ? `${member.firstName} ${member.lastName || ''}`
      : `Member-${member.memberId}`

  public linkClickHandler = (id: string) => history.push(`/members/${id}`)

  public getTableRow = (item: Member) => {
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

  public sortTable = (sortBy: MembersSortBy) => {
    const {
      searchMemberRequest,
      members: { searchFilter },
    } = this.props

    if (searchFilter.sortBy !== sortBy) {
      searchMemberRequest({
        ...searchFilter,
        sortBy,
        sortDirection: 'DESC',
        page: 0,
      })
    } else {
      searchMemberRequest({
        ...searchFilter,
        sortDirection: searchFilter.sortDirection === 'DESC' ? 'ASC' : 'DESC',
        page: 0,
      })
    }
  }

  public changePage = (page: number) => {
    const {
      searchMemberRequest,
      members: { searchFilter },
    } = this.props
    searchMemberRequest({ ...searchFilter, page })
  }

  public getTableHeader = () => {
    const searchFilter = this.props.members.searchFilter
    const { sortBy, sortDirection } = searchFilter
    const direction = sortDirection === 'DESC' ? 'descending' : 'ascending'

    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            sorted={sortBy === 'NAME' ? direction : undefined}
            onClick={this.sortTable.bind(this, 'NAME')}
          >
            Name
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={sortBy === 'CREATED' ? direction : undefined}
            onClick={this.sortTable.bind(this, 'CREATED')}
          >
            Created
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={sortBy === 'SIGN_UP' ? direction : undefined}
            onClick={this.sortTable.bind(this, 'SIGN_UP')}
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
      members: { searchResult },
    } = this.props
    return (
      <BackendPaginatorList<Member>
        pagedItems={searchResult.members}
        currentPage={searchResult.page}
        totalPages={searchResult.totalPages}
        itemContent={this.getTableRow}
        changePage={this.changePage}
        isSortable={true}
        tableHeader={this.getTableHeader()}
        keyName="memberId"
      />
    )
  }
}