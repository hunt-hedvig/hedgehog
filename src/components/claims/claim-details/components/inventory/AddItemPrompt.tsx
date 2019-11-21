import { EditableCategoryDropdown } from 'components/claims/claim-details/components/inventory/EditableCategoryDropdown'
import { InventoryFilterContainer } from 'components/claims/claim-details/components/inventory/InventoryFilterContainer'
import { ADD_ITEM } from 'features/pricing/mutations'
import { GET_ALL_FILTERS, GET_INVENTORY } from 'features/pricing/queries'
import * as React from 'react'
import { Mutation, Query } from 'react-apollo'
import { Button, Input, Loader } from 'semantic-ui-react'

export class AddItemPrompt extends React.Component {
  public constructor(props) {
    super(props)
    this.state = {
      itemFilters: [],
      itemName: props.activeItem ? props.activeItem.name : '',
      itemValue: props.activeItem ? Math.floor(props.activeItem.amount) : '',
      itemCategory: props.activeItem ? props.activeItem.category.id : null,
      showFilters: false,
      searchQuery: props.activeItem ? props.activeItem.category.name : '',
    }
  }

  public addFilter = ({ name, value }) => {
    this.setState((state) => {
      return {
        itemFilters: [...state.itemFilters, { name, value }],
        offset: 0,
      }
    })
  }

  public removeFilter = ({ name, value }) => {
    this.setState((state) => {
      return {
        itemFilters: state.itemFilters.filter(
          (e) => e.name !== name && e.value !== value,
        ),
      }
    })
  }

  public areFieldsPopulated = () => {
    return (
      /^[0-9]+$/.test(this.state.itemValue) &&
      this.state.itemCategory !== 'None' &&
      this.state.searchQuery !== 'None' &&
      this.state.itemName !== ''
    )
  }

  public handleDropdownChange = (e, { value }) => {
    this.setState({ searchQuery: e.target.textContent, itemCategory: value })
  }

  public handleDropdownSearchChange = (e, { searchQuery }) => {
    this.setState({ searchQuery })
    this.setState({ itemCategory: -1 })
  }

  public handleChange = (event, { name, value }) => {
    this.setState({ [name]: value })
  }

  public close = () => {
    this.setState({ prepopulated: false })
    this.props.closePrompt()
  }

  public populate = (props) => {
    if (props.activeItem) {
      this.setState({
        itemName: props.activeItem.name,
        itemValue: Math.floor(props.activeItem.amount),
        itemCategory: props.activeItem.category.id,
        searchQuery: props.activeItem.category.name,
      })
    }
  }

  public componentWillReceiveProps(nextProps) {
    this.populate(nextProps)
  }

  public render() {
    const locked = this.props.activeItem ? true : false
    const fromDatabase = this.props.activeItem !== null

    return (
      <div style={{ display: 'inline-block', padding: '10px' }}>
        <Input
          disabled={locked}
          type="text"
          style={{ width: '100%', marginTop: '7px' }}
          placeholder="Item name"
          action
          name="itemName"
          onChange={this.handleChange}
          value={this.state.itemName}
        />

        <EditableCategoryDropdown
          searchQuery={this.state.searchQuery}
          value={locked ? null : this.state.itemCategory}
          handleChange={this.handleDropdownChange}
          handleSearchChange={this.handleDropdownSearchChange}
          locked={locked}
        />

        <Input
          type="text"
          style={{ width: '35%', marginTop: '7px', float: 'right' }}
          placeholder="Value"
          name="itemValue"
          value={this.state.itemValue}
          onChange={this.handleChange}
          action
        />

        <Mutation
          mutation={ADD_ITEM}
          refetchQueries={() => [
            {
              query: GET_INVENTORY,
              variables: { claimId: this.props.claimId },
            },
          ]}
        >
          {(addItem, addItemMutation) => {
            if (addItemMutation.error) {
              return <React.Fragment />
            }

            return (
              <Button
                disabled={!this.areFieldsPopulated() || addItemMutation.loading}
                size="small"
                primary
                style={{ marginTop: '7px' }}
                onClick={async (e) => {
                  e.preventDefault()
                  await addItem({
                    variables: {
                      item: {
                        inventoryItemId: null,
                        claimId: this.props.claimId,
                        itemName: this.state.itemName,
                        categoryName: this.state.searchQuery,
                        categoryId: this.state.itemCategory,
                        value: this.state.itemValue,
                        source: fromDatabase ? 'Database' : 'Custom',
                        upperRange: fromDatabase
                          ? this.props.activeItem.range.upper
                          : null,
                        lowerRange: fromDatabase
                          ? this.props.activeItem.range.lower
                          : null,
                        itemId: fromDatabase
                          ? this.props.activeItem.refId
                          : null,
                        filters: this.state.itemFilters,
                      },
                    },
                  })
                  this.close()
                }}
              >
                OK
              </Button>
            )
          }}
        </Mutation>

        <Button
          color="grey"
          size="small"
          style={{ marginTop: '7px', marginLeft: '7px' }}
          onClick={this.close}
        >
          Cancel
        </Button>

        <Query
          query={GET_ALL_FILTERS}
          variables={{
            categoryId: this.state.itemCategory ? this.state.itemCategory : -1,
          }}
        >
          {({ data, loading, error }) => {
            if (error) {
              return null
            }

            return (
              <React.Fragment>
                <Button
                  disabled={
                    this.state.itemCategory === 'Övrigt' ||
                    this.state.itemCategory === null ||
                    Boolean(this.props.activeItem)
                  }
                  color="teal"
                  size="small"
                  style={{
                    marginTop: '7px',
                    marginLeft: '7px',
                    float: 'right',
                  }}
                  onClick={() =>
                    this.setState({ showFilters: !this.state.showFilters })
                  }
                >
                  {this.state.showFilters ? 'Hide filters' : 'Show filters'}
                </Button>

                {this.state.showFilters && loading && (
                  <Loader
                    active
                    inline="centered"
                    style={{ marginTop: '20px' }}
                  />
                )}
                {this.state.showFilters && !loading && (
                  <InventoryFilterContainer
                    filters={data.filters}
                    activeFilters={this.state.itemFilters}
                    addFilter={this.addFilter}
                    removeFilter={this.removeFilter}
                  />
                )}
              </React.Fragment>
            )
          }}
        </Query>
      </div>
    )
  }
}
