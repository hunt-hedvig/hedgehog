import * as React from 'react'
import { Label, Table } from 'semantic-ui-react'

export default class ItemTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      prices: {},
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    if (prevProps.items !== this.props.items) {
      let ids = '?'

      this.props.items.products
        .slice(0, 10)
        .map((row) => (ids += '&id=' + row.item.id))

      fetch(
        'http://127.0.0.1:5000/api/v1/prices?date=' +
          this.props.date +
          '&id=' +
          ids,
      )
        .then((response) => response.json())
        .then((priceData) =>
          // tslint:disable-next-line:no-console

          this.setState({ prices: { ...this.state.prices, ...priceData } }),
        )
    }
  }

  public render() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Range</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.props.items.products.slice(0, 10).map((row) => (
            <Table.Row>
              <Table.Cell>
                <a
                  style={{ textDecoration: 'none', color: '#444' }}
                  href={'http://127.0.0.1:5000/api/v1/items/' + row.item.id}
                >
                  {row.item.name}
                </a>
              </Table.Cell>
              <Table.Cell textAlign="center" verticalAlign="middle">
                {row.item.id in this.state.prices ? (
                  <Label basic as="a" color="green">
                    {Math.floor(
                      this.state.prices[row.item.id].mean[this.props.date],
                    ).toLocaleString('ru-RU')}{' '}
                    kr
                  </Label>
                ) : (
                  <Label basic as="a" color="grey">
                    …
                  </Label>
                )}
              </Table.Cell>
              <Table.Cell textAlign="center" verticalAlign="middle">
                {row.item.id in this.state.prices ? (
                  <Label basic as="a" color="blue">
                    {Math.floor(
                      this.state.prices[row.item.id].lower[this.props.date],
                    ).toLocaleString('ru-RU')}{' '}
                    kr{'  '}-{'  '}
                    {Math.floor(
                      this.state.prices[row.item.id].upper[this.props.date],
                    ).toLocaleString('ru-RU')}{' '}
                    kr
                  </Label>
                ) : (
                  <Label basic as="a" color="grey">
                    …
                  </Label>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }
}
