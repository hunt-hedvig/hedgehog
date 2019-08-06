import { InventoryEntry } from 'components/pricing/InventoryEntry'
import { GET_CATEGORIES } from 'features/pricing/queries'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Button, Dropdown, Icon, Input, Table } from 'semantic-ui-react'
import { Paper } from '../../../shared/Paper'

export default class EditableCategoryDropdown extends React.Component {
  public render() {
    const { searchQuery, value } = this.props

    return (
      <Query query={GET_CATEGORIES}>
        {({ loading, error, data }) => {
          if (error) {
            return error
          }

          return (
            <Dropdown
              fluid
              disabled={this.props.locked}
              onChange={this.props.handleChange}
              onSearchChange={this.props.handleSearchChange}
              options={
                loading
                  ? [{ key: 1, text: 'None', value: 1 }]
                  : data.categories.map((item) => {
                      return {
                        key: item.id,
                        text: item.name.split(' > ')[
                          item.name.split(' > ').length - 1
                        ],
                        value: item.id,
                      }
                    })
              }
              search
              searchQuery={searchQuery}
              placeholder="Category"
              selection
              value={value}
              style={{ marginTop: '7px', width: '60%', float: 'left' }}
            />
          )
        }}
      </Query>
    )
  }
}

// tslint:disable-next-line:max-classes-per-file
class AddItemPrompt extends React.Component {
  public state = {
    itemName: '',
    itemCategory: null,
    searchQuery: '',
    itemValue: '',
    prepopulated: false,
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

  public addItem = () => {
    const fromDatabase = this.props.activeItem !== null

    this.props.addItem(
      fromDatabase ? this.props.activeItem.refId : null,
      this.state.itemName,
      { name: this.state.searchQuery, id: this.state.itemCategory },
      {
        mean: this.state.itemValue,
        upper: fromDatabase ? this.props.activeItem.range.upper : null,
        lower: fromDatabase ? this.props.activeItem.range.lower : null,
      },
      fromDatabase ? 'Database' : 'Custom',
    )
    this.close()
  }

  public populate = () => {
    if (this.props.activeItem) {
      if (!this.state.prepopulated) {
        this.setState({
          itemName: this.props.activeItem.name,
          itemValue: Math.floor(this.props.activeItem.amount),
          itemCategory: this.props.activeItem.category.id,
          searchQuery: this.props.activeItem.category.name,
          prepopulated: true,
        })
      }
    }
  }

  public componentDidMount() {
    this.populate()
  }

  public componentWillReceiveProps(nextProps) {
    this.populate()
  }

  public render() {
    const locked = this.props.activeItem ? true : false

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

        <Button
          size="small"
          primary
          style={{ marginTop: '7px' }}
          onClick={this.addItem}
        >
          Add
        </Button>
        <Button
          color="grey"
          size="small"
          style={{ marginTop: '7px', marginLeft: '7px' }}
          onClick={this.close}
        >
          Cancel
        </Button>
      </div>
    )
  }
}

// tslint:disable-next-line:max-classes-per-file
class InventoryList extends React.Component {
  public render() {
    return (
      <Table>
        {this.props.items.length !== 0 ? (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
              <Table.HeaderCell width={3} />
            </Table.Row>
          </Table.Header>
        ) : null}

        <Table.Body>
          {this.props.items.map((item) => (
            <InventoryEntry
              key={item.name + Date.now() * (1 + Math.random()).toString()}
              item={item}
              removeItem={this.props.removeItem}
            />
          ))}
        </Table.Body>
      </Table>
    )
  }
}

// tslint:disable-next-line:max-classes-per-file
export class ClaimInventory extends React.Component {
  public state = {
    addNew: false,
  }

  public componentWillReceiveProps(nextProps) {
    if (!this.state.addNew) {
      if (nextProps.activeItem) {
        this.setState({ addNew: true })
      }
    }
  }

  public closePrompt = () => {
    this.setState({ addNew: false })
    this.props.clearActiveItem()
  }

  public render() {
    return (
      <Paper>
        <div>
          <h3>{this.state.addNew ? 'Add item' : 'Inventory'}</h3>
        </div>

        {this.state.addNew ? (
          <AddItemPrompt
            closePrompt={this.closePrompt}
            addItem={this.props.addItem}
            activeItem={this.props.activeItem}
          />
        ) : (
          <React.Fragment>
            <InventoryList
              items={this.props.items}
              removeItem={this.props.removeItem}
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
