import { formatMoney } from 'lib/intl'
import * as React from 'react'
import { Button, Icon, Input, Label, Popup, Table } from 'semantic-ui-react'

export class InventoryEntry extends React.Component {
  public remove = () => {
    this.props.removeItem(this.props.item)
  }

  public render() {
    const item = this.props.item

    String.prototype.trunc = function(n, useWordBoundary) {
      if (this.length <= n) {
        return this
      }
      const subString = this.substr(0, n - 1)
      return (
        (useWordBoundary
          ? subString.substr(0, subString.lastIndexOf(' '))
          : subString) + '...'
      )
    }

    return (
      <Table.Row>
        <Table.Cell>{item.name.trunc(25, true)}</Table.Cell>
        <Table.Cell textAlign="center" verticalAlign="middle">
          <Label basic color="blue">
            {formatMoney('sv-SE', 0)({
              amount: item.amount,
              currency: 'SEK',
            })}
          </Label>
        </Table.Cell>
        <Table.Cell textAlign="center" verticalAlign="middle">
          <Popup
            inverted
            wide
            trigger={<Icon color="blue" name="info circle" />}
            on="hover"
          >
            <Popup.Content>
              <Table color="black" key="black" inverted>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell textAlign="right">Category:</Table.Cell>
                    <Table.Cell>{item.category.name}</Table.Cell>
                  </Table.Row>

                  {item.range.upper !== null && item.range.lower !== null ? (
                    <Table.Row>
                      <Table.Cell textAlign="right">Range:</Table.Cell>
                      <Table.Cell>
                        <Label size="small" basic color="blue">
                          {formatMoney('sv-SE', 0)({
                            amount: item.range.lower,
                            currency: 'SEK',
                          }) +
                            ' - ' +
                            formatMoney('sv-SE', 0)({
                              amount: item.range.upper,
                              currency: 'SEK',
                            })}
                        </Label>
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    <React.Fragment />
                  )}

                  <Table.Row>
                    <Table.Cell textAlign="right">Source:</Table.Cell>
                    <Table.Cell>{item.source}</Table.Cell>
                  </Table.Row>

                  {item.refId !== null ? (
                    <Table.Row>
                      <Table.Cell textAlign="right">Item ID:</Table.Cell>
                      <Table.Cell>{item.refId}</Table.Cell>
                    </Table.Row>
                  ) : (
                    <React.Fragment />
                  )}
                </Table.Body>
              </Table>
            </Popup.Content>
          </Popup>

          <Icon color="red" name="remove circle" onClick={this.remove} />
        </Table.Cell>
      </Table.Row>
    )
  }
}
