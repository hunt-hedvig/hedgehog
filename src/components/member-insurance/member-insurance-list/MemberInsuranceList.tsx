import { LinkRow } from 'components/shared'
import PaginatorList from 'components/shared/paginator-list/PaginatorList'
import * as moment from 'moment'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Table } from 'semantic-ui-react'
import { history } from 'store'

export default class MemberInsuranceList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      column: null,
      direction: null,
    }
  }

  public getMemberName = (member) =>
    member.memberFirstName
      ? `${member.memberFirstName} ${member.memberLastName || ''}`
      : `${member.memberId ? 'Member-' + member.memberId : 'No id'}`

  public linkClickHandler = (id) => {
    history.push(`/members/${id}`, { to: 'insurance' })
  }

  public getFormattedDate = (date) => {
    return date.isValid() ? date.format('DD MMMM YYYY') : '-'
  }

  public getTableRow = (item) => {
    // FIXME : we need to remove Z after insuranceActiveFrom and insuranceActiveTo when we will change the type of datetime from backend.
    const activationDate = moment(item.insuranceActiveFrom + 'Z').local()
    const cancellationDate = moment(item.insuranceActiveTo + 'Z').local()
    const signedOnDate = moment(item.signedOn).local()

    return (
      <LinkRow onClick={this.linkClickHandler.bind(this, item.memberId)}>
        <Table.Cell>{this.getMemberName(item)}</Table.Cell>
        <Table.Cell>{item.insuranceType}</Table.Cell>
        <Table.Cell>{this.getFormattedDate(signedOnDate)}</Table.Cell>
        <Table.Cell>{this.getFormattedDate(activationDate)}</Table.Cell>
        <Table.Cell>{this.getFormattedDate(cancellationDate)}</Table.Cell>
        <Table.Cell>{item.insuranceStatus}</Table.Cell>
        <Table.Cell>
          {item.cancellationEmailSent
            ? item.cancellationEmailSent.toString()
            : '-'}
        </Table.Cell>
        <Table.Cell>
          {item.certificateUploaded ? item.certificateUploaded.toString() : '-'}
        </Table.Cell>
        <Table.Cell>
          {item.personsInHouseHold ? item.personsInHouseHold.toString() : '-'}
        </Table.Cell>
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
      this.props.sortMemberInsList(clickedColumn, false)
      return
    }
    this.setState(
      {
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      },
      () => {
        this.props.sortMemberInsList(
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
            width={4}
            sorted={column === 'name' ? direction : null}
            onClick={this.sortTable.bind(this, 'name')}
          >
            Member fullname
          </Table.HeaderCell>
          <Table.HeaderCell
            width={2}
            sorted={column === 'insuranceType' ? direction : null}
            onClick={this.sortTable.bind(this, 'insuranceType')}
          >
            Type
          </Table.HeaderCell>
          <Table.HeaderCell
            width={3}
            sorted={column === 'signedOn' ? direction : null}
            onClick={this.sortTable.bind(this, 'signedOn')}
          >
            Sign up
          </Table.HeaderCell>
          <Table.HeaderCell
            width={3}
            sorted={column === 'insuranceActiveFrom' ? direction : null}
            onClick={this.sortTable.bind(this, 'insuranceActiveFrom')}
          >
            Active from
          </Table.HeaderCell>
          <Table.HeaderCell
            width={3}
            sorted={column === 'insuranceActiveTo' ? direction : null}
            onClick={this.sortTable.bind(this, 'insuranceActiveTo')}
          >
            Active to
          </Table.HeaderCell>
          <Table.HeaderCell
            width={2}
            sorted={column === 'insuranceStatus' ? direction : null}
            onClick={this.sortTable.bind(this, 'insuranceStatus')}
          >
            Status
          </Table.HeaderCell>
          <Table.HeaderCell
            width={1}
            sorted={column === 'cancellationEmailSent' ? direction : null}
            onClick={this.sortTable.bind(this, 'cancellationEmailSent')}
          >
            Cancellation
            <br />
            email sent
          </Table.HeaderCell>
          <Table.HeaderCell
            width={1}
            sorted={column === 'certificateUploaded' ? direction : null}
            onClick={this.sortTable.bind(this, 'certificateUploaded')}
          >
            Certificate
            <br />
            uploaded
          </Table.HeaderCell>
          <Table.HeaderCell
            width={1}
            sorted={column === 'personsInHouseHold' ? direction : null}
            onClick={this.sortTable.bind(this, 'personsInHouseHold')}
          >
            Household
            <br />
            size
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    )
  }
  public render() {
    const {
      memberInsurance: { list },
    } = this.props

    return (
      <PaginatorList
        list={list}
        itemContent={(item) => this.getTableRow(item)}
        tableHeader={this.getTableHeader()}
        pageSize={20}
        isSortable={true}
        keyName="productId"
      />
    )
  }
}

MemberInsuranceList.propTypes = {
  memberInsurance: PropTypes.object.isRequired,
  sortMemberInsList: PropTypes.func.isRequired,
}
