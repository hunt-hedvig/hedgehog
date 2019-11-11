import { ExtraBuilding } from 'components/chat/tabs/InsuranceTab'
import { LinkRow } from 'components/shared'
import PaginatorList from 'components/shared/paginator-list/PaginatorList'
import TableFields from 'components/shared/table-fields/TableFields'
import * as moment from 'moment'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header, Table } from 'semantic-ui-react'

export default class InsuranceList extends React.Component {
  public insuranceFieldFormatters = {
    extraBuildings: (buildings: ExtraBuilding[]) =>
      buildings.map((building) => (
        <p key={building.id}>
          {building.displayName} {building.area} m<sup>2</sup> (
          {building.hasWaterConnected
            ? 'has water connected'
            : 'no water connected'}
          )
        </p>
      )),
  }
  constructor(props) {
    super(props)
    this.state = {
      column: null,
      direction: null,
      item: null,
    }
  }

  public getFormattedDate = (date) => {
    return date.isValid() ? date.format('DD MMMM YYYY') : '-'
  }

  public linkClickHandler = (i, d) => {
    if (d.productId === i.productId) {
      this.setState({ item: null })
    } else {
      this.setState({ item: i })
    }
  }

  public isTheActiveInsurance = (item, data) => {
    if (item.productId === data.productId) {
      return true
    }
    return false
  }

  public getTableRow = (item, data) => {
    // FIXME : we need to remove Z after insuranceActiveFrom and insuranceActiveTo when we will change the type of datetime from backend.
    const activationDate = moment(item.insuranceActiveFrom + 'Z').local()
    const cancellationDate = moment(item.insuranceActiveTo + 'Z').local()

    return (
      <LinkRow
        positive={this.isTheActiveInsurance(item, data)}
        onClick={this.linkClickHandler.bind(this, item, data)}
      >
        <Table.Cell>{item.insuranceType}</Table.Cell>
        <Table.Cell>
          {item.street + ' ' + item.city + ' ' + item.zipCode}
        </Table.Cell>
        <Table.Cell>{item.livingSpace}</Table.Cell>
        <Table.Cell>{item.personsInHouseHold}</Table.Cell>
        <Table.Cell>{this.getFormattedDate(activationDate)}</Table.Cell>
        <Table.Cell>{this.getFormattedDate(cancellationDate)}</Table.Cell>
        <Table.Cell>{item.currentTotalPrice}</Table.Cell>
        <Table.Cell>{item.insuranceStatus}</Table.Cell>
      </LinkRow>
    )
  }

  public getTableHeader = () => {
    const { column, direction } = this.state
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            width={1}
            sorted={column === 'insuranceType' ? direction : null}
            // onClick={this.sortTable.bind(this, "insuranceType")}
          >
            Type
          </Table.HeaderCell>
          <Table.HeaderCell
            width={3}
            sorted={column === 'address' ? direction : null}
            // onClick={this.sortTable.bind(this, "insuranceType")}
          >
            Address
          </Table.HeaderCell>
          <Table.HeaderCell
            width={1}
            sorted={column === 'space' ? direction : null}
            // onClick={this.sortTable.bind(this, "insuranceType")}
          >
            ㎡
          </Table.HeaderCell>
          <Table.HeaderCell
            width={1}
            sorted={column === 'space' ? direction : null}
            // onClick={this.sortTable.bind(this, "insuranceType")}
          >
            Household Size
          </Table.HeaderCell>
          <Table.HeaderCell
            width={3}
            sorted={column === 'insuranceActiveFrom' ? direction : null}
            // onClick={this.sortTable.bind(this, "insuranceActiveFrom")}
          >
            Active from
          </Table.HeaderCell>
          <Table.HeaderCell
            width={3}
            sorted={column === 'insuranceActiveTo' ? direction : null}
            // onClick={this.sortTable.bind(this, "insuranceActiveTo")}
          >
            Active to
          </Table.HeaderCell>
          <Table.HeaderCell
            width={1}
            sorted={column === 'currentTotalPrice' ? direction : null}
            // onClick={this.sortTable.bind(this, "insuranceStatus")}
          >
            Price
          </Table.HeaderCell>
          <Table.HeaderCell
            width={1}
            sorted={column === 'insuranceStatus' ? direction : null}
            // onClick={this.sortTable.bind(this, "insuranceStatus")}
          >
            Status
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    )
  }

  public render() {
    const {
      insurance: { data, list },
    } = this.props

    return (
      <>
        {list ? (
          <>
            {this.state.item && (
              <>
                <Header> Selected Insurance </Header>
                <Table>
                  <Table.Body>
                    <TableFields
                      fields={this.state.item}
                      fieldFormatters={this.insuranceFieldFormatters}
                    />
                  </Table.Body>
                </Table>
              </>
            )}
            <PaginatorList
              list={list}
              itemContent={(item) => this.getTableRow(item, data)}
              tableHeader={this.getTableHeader()}
              pageSize={3}
              isSortable={false}
              keyName="productId"
            />
          </>
        ) : (
          <Header>No insurances found</Header>
        )}
      </>
    )
  }
}

InsuranceList.propTypes = {
  insurance: PropTypes.object.isRequired,
  activateQuote: PropTypes.func.isRequired,
}
