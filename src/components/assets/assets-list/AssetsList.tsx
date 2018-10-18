import AssetCard from 'components/assets/asset-card/AssetCard'
import { ListContainer } from 'components/shared'
import Fliter from 'components/shared/filter/Filter'
import Pagination from 'components/shared/pagination/Pagination'
import { assetStates } from 'lib/selectOptions'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Button, Card } from 'semantic-ui-react'
import styled from 'styled-components'

const FilterMessage = styled.p`
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
`

const CardGroup = styled(Card.Group)`
  &&& {
    margin: 30px 0;
  }
`
class AssetsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeList: [],
      filteredList: [],
      activeFilter: 'ALL',
    }
  }

  public onChangePage(activeList) {
    this.setState({ activeList })
  }

  public filterChangeHandler(activeFilter, filteredList) {
    this.setState({ activeFilter, filteredList })
  }

  public render() {
    const {
      assets: { list },
      poll: { polling },
      messages: { member },
      memberRequest,
      pollingHandler,
      assetUpdate,
    } = this.props
    const { activeList, filteredList, activeFilter } = this.state
    const items = activeFilter === 'ALL' ? list : filteredList
    return (
      <ListContainer autoWidth={true}>
        <Fliter
          list={list}
          activeFilter={this.state.activeFilter}
          filterChange={this.filterChangeHandler}
          options={assetStates}
          fieldName="state"
        />
        <Button onClick={pollingHandler} size="mini">
          Poll {polling ? 'stop' : 'start'}
        </Button>
        <CardGroup itemsPerRow={4}>
          {list && !!activeList.length ? (
            activeList.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                assetUpdate={assetUpdate}
                memberRequest={memberRequest}
                member={member}
              />
            ))
          ) : (
            <FilterMessage>
              No items by this filter. Select other.
            </FilterMessage>
          )}
        </CardGroup>
        <Pagination
          items={items}
          onChangePage={this.onChangePage}
          pageSize={12}
        />
      </ListContainer>
    )
  }
}

export default AssetsList

AssetsList.propTypes = {
  assetUpdate: PropTypes.func.isRequired,
  assets: PropTypes.object,
  poll: PropTypes.object,
  setClient: PropTypes.func.isRequired,
  assetRequest: PropTypes.func.isRequired,
  memberRequest: PropTypes.func.isRequired,
  messages: PropTypes.object.isRequired,
  pollingHandler: PropTypes.func.isRequired,
}
