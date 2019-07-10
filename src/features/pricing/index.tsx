import ItemCounter from 'components/pricing/ItemCounter'
import ItemTable from 'components/pricing/ItemTable'
import { ListPage } from 'components/shared'
import * as React from 'react'
import { Dropdown, Form, Header, Icon, Input, Label } from 'semantic-ui-react'
import styled from 'styled-components'

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`

const FilterContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const PropContainer = styled.div`
  margin-top: 0.6em;
  justify-content: space-between;
  width: 100%;
`

export default class Pricing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeCategory: '',
      activeFilter: '',
      dateInput: '',
      activeDate: new Date().toJSON().slice(0, 10),
      datePlaceholder: 'Date...',
      categoryData: [{ key: 1, text: 'None', value: 1 }],
      itemData: { products: [], suggestions: [] },
      priceData: {},
      column: null,
      direction: null,
      label_colors: ['blue'],
      filters: [],
      offset: 0,
    }

    this.searchItems = this.searchItems.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.mapCategoryData = this.mapCategoryData.bind(this)
    this.addFilter = this.addFilter.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.searchPrices = this.searchPrices.bind(this)
  }

  public searchItems() {
    let filterStr = ''

    this.state.filters.map(
      (row) => (filterStr += '&' + row.category + '=' + row.name),
    )

    fetch(
      'http://127.0.0.1:5000/api/v1/items/search?query=' +
        this.state.activeFilter +
        '&category=' +
        this.state.activeCategory +
        filterStr,
    )
      .then((response) => response.json())
      .then((itemData) => this.setState({ itemData }, this.searchPrices))
  }

  public searchPrices() {
    let ids = '?'

    this.state.itemData.products
      .slice(this.state.offset, 20 + this.state.offset)
      .map((row) => (ids += '&id=' + row.item.id))

    fetch('http://127.0.0.1:5000/api/v1/prices?' + ids)
      .then((response) => response.json())
      .then((priceData) => this.setState({ priceData }))
  }

  public handleChange = (e, { name, value }) => {
    if (name === 'activeDate') {
      if (value.length === 10) {
        this.searchPrices()
      }
    }

    this.setState({ [name]: value })
  }

  public switchCategory = (e, { name, value }) => {
    this.setState({ filters: [] })
    this.setState({ itemData: { products: [], suggestions: [] } })
    this.setState({ activeFilter: '' })
    this.setState({ [name]: value })
  }

  public mapCategoryData(catData) {
    const result: Object[] = []

    Object.keys(catData).map((Key) => {
      return result.push({
        key: Key,
        text: catData[Key].split(' > ')[catData[Key].split(' > ').length - 1],
        value: Key,
      })
    })

    this.setState({ categoryData: result })
  }

  public componentDidMount() {
    fetch('http://127.0.0.1:5000/api/v1/categories')
      .then((response) => response.json())
      .then((categoryData) => this.mapCategoryData(categoryData))
  }

  public addFilter(e, itemRow, categoryRow) {
    this.setState(
      {
        filters: [
          ...this.state.filters,
          { name: itemRow, category: categoryRow.name },
        ],
      },
      this.searchItems,
    )
  }

  public removeFilter(ev, filterRow) {
    this.setState(
      {
        filters: this.state.filters.filter(
          (e) => e.category !== filterRow.category,
        ),
      },
      this.searchItems,
    )
  }

  public render() {
    return (
      <ListPage>
        <React.Fragment>
          <HeaderContainer>
            <Header size="huge">Pricing</Header>
          </HeaderContainer>

          <FilterContainer>
            <Dropdown
              placeholder="Category"
              name="activeCategory"
              search
              selection
              onChange={this.switchCategory}
              value={this.state.activeCategory}
              options={this.state.categoryData}
            />

            <Input
              icon="date"
              name="activeDate"
              onChange={this.handleChange}
              value={this.state.activeDate}
              placeholder='Date...'
            />

            <Form onSubmit={this.searchItems}>
              <Input
                icon="search"
                name="activeFilter"
                onChange={this.handleChange}
                value={this.state.activeFilter}
                placeholder="Filter..."
              />
            </Form>
          </FilterContainer>

          <HeaderContainer>
            {this.state.filters.length !== 0 ? (
              <Header size="small">Active filters</Header>
            ) : (
              ''
            )}
          </HeaderContainer>

          <PropContainer>
            {this.state.filters.map((filterRow) => (
              <Label
                basic
                as="a"
                color="blue"
                onClick={(e) => this.removeFilter(e, filterRow)}
              >
                {filterRow.name}
                <Label.Detail>({filterRow.category})</Label.Detail>
                <Icon name="delete" />
              </Label>
            ))}
          </PropContainer>

          {this.state.itemData.suggestions.length !== 0 ? (
            <HeaderContainer>
              {' '}
              <Header size="small">Suggested filters</Header>{' '}
            </HeaderContainer>
          ) : (
            ''
          )}

          {this.state.itemData.suggestions.map((categoryRow) => (
            <PropContainer>
              <Label.Group color={this.state.label_colors[0]}>
                {categoryRow.items.map((itemRow) => (
                  <Label
                    as="a"
                    onClick={(e) => this.addFilter(e, itemRow, categoryRow)}
                  >
                    {itemRow}
                    <Label.Detail>({categoryRow.name})</Label.Detail>
                  </Label>
                ))}

                {categoryRow.others.length !== 0 ? (
                  <Dropdown text="">
                    <Dropdown.Menu>
                      {categoryRow.others.map((itemRow) => (
                        <Dropdown.Item
                          text={itemRow + ' (' + categoryRow.name + ')'}
                          onClick={(e) =>
                            this.addFilter(e, itemRow, categoryRow)
                          }
                        />
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  ''
                )}
              </Label.Group>
            </PropContainer>
          ))}

          <ItemTable items={this.state.itemData} date={this.state.activeDate} />
          <ItemCounter
            items={this.state.itemData.products}
            offset={this.state.offset}
          />
        </React.Fragment>
      </ListPage>
    )
  }
}
