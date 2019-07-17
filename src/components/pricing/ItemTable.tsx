import { GET_PRICES } from 'features/pricing/queries'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Label, Table } from 'semantic-ui-react'

export default class ItemTable extends React.Component {
  public state = {
    priceData: [],
  }

  public handlePriceData = (data) => {
    if (data) {
      return 'prices' in data
        ? Object.assign({}, ...data.prices.map((s) => ({ [s.id]: s })))
        : {}
    }

    return {}
  }

  public getItemIds = () => {
    const { products } = this.props.items
    return [...new Set(products.slice(0, 10).map((item) => item.id))]
  }

  public render() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={9}>Name</Table.HeaderCell>
            <Table.HeaderCell width={3}>Price</Table.HeaderCell>
            <Table.HeaderCell width={4}>Range</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Query
            query={GET_PRICES}
            variables={{ date: this.props.date, ids: this.getItemIds() }}
          >
            {({ loading, data }) => {
              const prices = this.handlePriceData(data)
              return this.props.items.products.slice(0, 10).map((row) => (
                <Table.Row>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell textAlign="center" verticalAlign="middle">
                    <Label
                      basic
                      as="a"
                      color={
                        loading ? 'grey' : row.id in prices ? 'green' : 'grey'
                      }
                    >
                      {loading
                        ? '…'
                        : row.id in prices
                        ? Math.floor(prices[row.id].mean).toLocaleString(
                            'sv-SE',
                          ) + ' kr'
                        : '…'}
                    </Label>
                  </Table.Cell>
                  <Table.Cell textAlign="center" verticalAlign="middle">
                    <Label
                      basic
                      as="a"
                      color={
                        loading ? 'grey' : row.id in prices ? 'blue' : 'grey'
                      }
                    >
                      {loading
                        ? '…'
                        : row.id in prices
                        ? Math.floor(prices[row.id].lower).toLocaleString(
                            'sv-SE',
                          ) +
                          ' kr - ' +
                          Math.floor(prices[row.id].upper).toLocaleString(
                            'sv-SE',
                          ) +
                          ' kr'
                        : '…'}
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
