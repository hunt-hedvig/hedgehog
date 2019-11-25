import { GET_PRICES } from 'features/pricing/queries'
import { formatMoney } from 'lib/intl'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Label, Table } from 'semantic-ui-react'

export class ItemTable extends React.Component {
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
    return [...products.map((item) => item.id)]
  }

  public getRangeColor = (prices, row) => {
    if (row.id in prices) {
      const colors = ['red', 'orange', 'yellow', 'olive', 'green']

      const score = Math.max(
        1 - (prices[row.id].upper - prices[row.id].lower) / prices[row.id].mean,
        0,
      )

      return colors[Math.floor(score * 5)]
    } else {
      return 'grey'
    }
  }

  public getPriceString = (prices, row, property) => {
    return row.id in prices
      ? formatMoney(
          'sv-SE',
          0,
        )({
          amount: Math.max(prices[row.id][property], 0),
          currency: 'SEK',
        })
      : '…'
  }

  public render() {
    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={9}>Name</Table.HeaderCell>
            <Table.HeaderCell>Est. Price</Table.HeaderCell>
            <Table.HeaderCell>Est. Range</Table.HeaderCell>
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

              return this.props.items.products.map((row) => (
                <Table.Row
                  key={row.id}
                  onClick={() =>
                    this.props.selectionHandle(
                      row.id,
                      row.name,
                      this.props.category,
                      row.id in prices ? prices[row.id] : null,
                    )
                  }
                >
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell textAlign="center" verticalAlign="middle">
                    <Label
                      basic
                      color={this.getLabelColor(
                        loading,
                        row.id in prices,
                        'teal',
                      )}
                    >
                      {loading ? '…' : this.getPriceString(prices, row, 'mean')}
                    </Label>
                  </Table.Cell>
                  <Table.Cell textAlign="center" verticalAlign="middle">
                    <Label basic color={this.getRangeColor(prices, row)}>
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
