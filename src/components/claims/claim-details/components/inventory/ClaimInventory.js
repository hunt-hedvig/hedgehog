import { AddItemPrompt } from 'components/claims/claim-details/components/inventory/AddItemPrompt'
import { InventoryList } from 'components/claims/claim-details/components/inventory/InventoryList'
import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { Paper } from '../../../../shared/Paper'

export class ClaimInventory extends React.Component {
  state = {
    addNew: false,
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.addNew) {
      if (nextProps.activeItem) {
        this.setState({ addNew: true })
      }
    }
  }

  closePrompt = () => {
    this.setState({ addNew: false })
    this.props.clearActiveItem()
  }

  render() {
    return (
      <Paper>
        <div>
          <h3>{this.state.addNew ? 'Add item' : 'Inventory'}</h3>
        </div>

        {this.state.addNew ? (
          <AddItemPrompt
            closePrompt={this.closePrompt}
            activeItem={this.props.activeItem}
            claimId={this.props.claimId}
          />
        ) : (
          <React.Fragment>
            <InventoryList
              items={this.props.items}
              removeItem={this.props.removeItem}
              claimId={this.props.claimId}
            />
            <Button
              size="tiny"
              primary
              style={{ width: '25%', float: 'right' }}
              onClick={() => this.setState({ addNew: true })}
            >
              <Icon name="plus" />
              Add
            </Button>
          </React.Fragment>
        )}
      </Paper>
    )
  }
}
