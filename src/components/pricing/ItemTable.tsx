import { GET_PRICES } from 'features/pricing/queries'
import { formatMoney } from 'lib/intl'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Label, Table } from 'semantic-ui-react'

export default class ItemTable extends React.Component {
  public handlePriceData = (data) => {
    if (data && 'prices' in data) {
      return data.prices.reduce(
        (accumulator, s) => ({ ...accumulator, [s.itemId]: s }),
        {},
      )
    }

    return {}
  }

  public getLabelColor = (loading, priceExist, expectedColor) => {
    if (loading) {
      return 'grey'
    }

    return priceExist ? expectedColor : 'grey'
  }

  public getItemIds = (products) => {
    return [...new Set(products.slice(0, 10).map((item) => item.id))]
  }

  public getPriceString = (prices, row, property) => {
    return row.id in prices
      ? formatMoney('sv-SE', 0)({
          amount: prices[row.id][property],
          currency: 'SEK',
        })
      : '…'
  }

  public render() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={8}>Name</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Range</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Query
            query={GET_PRICES}
            variables={{
              date: this.props.date,
              ids: this.getItemIds(this.props.items.products),
            }}
          >
            {({ loading, data }) => {
              const prices = this.handlePriceData(data)
              return this.props.items.products.slice(0, 10).map((row) => (
                <Table.Row key={row.id}>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell textAlign="center" verticalAlign="middle">
                    <Label
                      basic
                      as="a"
                      color={this.getLabelColor(
                        loading,
                        row.id in prices,
                        'green',
                      )}
                    >
                      {loading ? '…' : this.getPriceString(prices, row, 'mean')}
                    </Label>
                  </Table.Cell>
                  <Table.Cell textAlign="center" verticalAlign="middle">
                    <Label
                      basic
                      as="a"
                      color={this.getLabelColor(
                        loading,
                        row.id in prices,
                        'blue',
                      )}
                    >
                      {loading
                        ? '…'
                        : this.getPriceString(prices, row, 'lower') +
                          ' - ' +
                          this.getPriceString(prices, row, 'upper')}
                    </Label>
                  </Table.Cell>
                </Table.Row>
              ))
            }}
          </Query>
        </Table.Body>
      </Table>
    )
  }
}
