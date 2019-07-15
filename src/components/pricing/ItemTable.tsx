import * as React from 'react'
import { Label, Table } from 'semantic-ui-react'

export default class ItemTable extends React.Component {
  constructor(props) {
    super(props)
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
              <Table.Cell>{row.name}</Table.Cell>

              <Table.Cell textAlign="center" verticalAlign="middle">
                <Label basic as="a" color="grey">
                  …
                </Label>
              </Table.Cell>

              <Table.Cell textAlign="center" verticalAlign="middle">
                <Label basic as="a" color="grey">
                  …
                </Label>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }
}
