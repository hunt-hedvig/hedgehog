import Grid from '@material-ui/core/Grid'
import Pricing from 'features/pricing/index'
import * as React from 'react'
import { Paper } from '../../../shared/Paper'
import { ClaimInventory } from './ClaimInventory'

export class ClaimItemDatabase extends React.Component {
  public state = {
    items: [
      {
        name: 'Some item just right here',
        category: { name: 'Mobiltelefoner', id: '1' },
        amount: 500000.0,
        source: 'Database',
        range: { lower: 2500, upper: 7500 },
        refId: '123456789',
      },
      {
        name: 'Another custom item here',
        category: { name: 'Mobiltelefoner', id: null },
        amount: 5000.0,
        source: 'Custom',
        range: { lower: 2500, upper: 7500 },
        refId: '123456789',
      },
    ],
    activeItem: null,
  }

  public selectItem = (refId, name, category, priceData) => {
    this.setState({
      activeItem: {
        name,
        category,
        refId,
        range: { lower: priceData.lower, upper: priceData.upper },
        amount: priceData.mean,
        source: 'Database',
      },
    })
  }

  public addItem = (refId, name, category, priceData, source) => {
    this.setState((prevState) => {
      return {
        items: [
          ...prevState.items,
          {
            name,
            category,
            refId,
            range: { lower: priceData.lower, upper: priceData.upper },
            amount: priceData.mean,
            source,
          },
        ],
      }
    })
  }

  public removeItem = (item) => {
    this.setState({
      items: this.state.items.filter((currentItem) => {
        return currentItem !== item
      }),
    })
  }

  public clearActiveItem = () => {
    this.setState({
      activeItem: null,
    })
  }

  public render() {
    return (
      <React.Fragment>
        <Grid item xs={12} sm={12} md={8}>
          <Paper>
            <h3>Item database</h3>
            <Pricing minimal selectionHandle={this.selectItem} />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <ClaimInventory
            items={this.state.items}
            type={this.props.type}
            claimId={this.props.claimId}
            removeItem={this.removeItem}
            addItem={this.addItem}
            selectItem={this.selectItem}
            activeItem={this.state.activeItem}
            clearActiveItem={this.clearActiveItem}
          />
        </Grid>
      </React.Fragment>
    )
  }
}
