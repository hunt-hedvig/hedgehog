import Grid from '@material-ui/core/Grid'
import Pricing from 'features/pricing'
import { GET_INVENTORY } from 'features/pricing/queries'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Paper } from '../../../../shared/Paper'
import { ClaimInventory } from './ClaimInventory'

export class ClaimItemDatabase extends React.Component {
  public state = {
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
          <Query
            query={GET_INVENTORY}
            pollInterval={2500}
            variables={{
              claimId: this.props.claimId,
            }}
            fetchPolicy="no-cache"
          >
            {({ data, loading, error }) => {
              let items = []

              if (!loading) {
                if (!error) {
                  if (typeof data !== 'undefined') {
                    if ('inventory' in data) {
                      items = data.inventory
                    }
                  }
                }
              }


              return (
                <ClaimInventory
                  items={items}
                  type={this.props.type}
                  claimId={this.props.claimId}
                  selectItem={this.selectItem}
                  activeItem={this.state.activeItem}
                  clearActiveItem={this.clearActiveItem}
                />
              )
            }}
          </Query>
        </Grid>
      </React.Fragment>
    )
  }
}
