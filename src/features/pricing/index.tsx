import {
  CategoryDropdown,
  FilterContainer,
  ItemTable,
} from 'components/pricing'
import { ListPage } from 'components/shared'
import { SEARCH_ITEMS } from 'features/pricing/queries'
import {
  HeaderContainer,
  InputContainer,
  PropContainer,
} from 'features/pricing/styles'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Header, Input } from 'semantic-ui-react'

export default class Pricing extends React.Component {
  public state = {
    activeCategory: '',
    activeQuery: '',
    activeDate: new Date().toJSON().slice(0, 10),
    activeFilters: [],
    usedDate: new Date().toJSON().slice(0, 10),

    categoryData: [{ key: 1, text: 'None', value: 1 }],
    itemData: { products: [], suggestions: [] },
    priceData: {},
  }

  public addFilter = (event, itemRow, categoryRow) => {
    this.setState((state) => {
      return {
        activeFilters: [
          ...state.activeFilters,
          { value: itemRow, name: categoryRow.name },
        ],
      }
    })
  }

  public removeFilter = (event, filterRow) => {
    this.setState((state) => {
      return {
        activeFilters: state.activeFilters.filter(
          (e) => e.name !== filterRow.name,
        ),
      }
    })
  }

  public isDateValid = (attemptedDate) => {
    const date = Date.parse(attemptedDate)

    if (!isNaN(date)) {
      const transformedDate = new Date(date).toJSON().slice(0, 10)

      if (transformedDate[0] !== '0' && transformedDate[0] !== '+') {
        return true
      }
    }

    return false
  }

  public handleChange = (event, { name, value }) => {
    if (name === 'activeDate' && this.isDateValid(value)) {
      this.setState({
        usedDate: new Date(Date.parse(value)).toJSON().slice(0, 10),
      })
    }

    this.setState({ [name]: value })
  }

  public render() {
    return (
      <React.Fragment>
        <ListPage>
          <HeaderContainer>
            <Header size="huge">Pricing</Header>
          </HeaderContainer>

          <HeaderContainer>
            <Query
              query={SEARCH_ITEMS}
              variables={{
                payload: {
                  category: this.state.activeCategory,
                  query: this.state.activeQuery,
                  filters: this.state.activeFilters,
                },
              }}
            >
              {({ loading, data }) => {
                const items =
                  data && Object.keys(data).length !== 0
                    ? data.items
                    : { products: [], suggestions: [] }

                return (
                  <div>
                    <InputContainer>
                      <CategoryDropdown
                        value={this.state.activeCategory}
                        handle={this.handleChange}
                      />

                      <Input
                        icon="calendar alternate outline"
                        name="activeDate"
                        onChange={this.handleChange}
                        value={this.state.activeDate}
                        placeholder="Date..."
                        error={!this.isDateValid(this.state.activeDate)}
                        autoComplete="off"
                      />

                      <Input
                        icon="search"
                        name="activeQuery"
                        onChange={this.handleChange}
                        value={this.state.activeQuery}
                        placeholder="Search..."
                        loading={loading}
                      />
                    </InputContainer>

                    <PropContainer>
                      <FilterContainer
                        items={items}
                        filters={this.state.activeFilters}
                        addFilter={this.addFilter}
                        removeFilter={this.removeFilter}
                      />
                    </PropContainer>

                    <ItemTable
                      items={items}
                      prices={this.state.priceData}
                      date={this.state.usedDate}
                    />
                  </div>
                )
              }}
            </Query>
          </HeaderContainer>
        </ListPage>
      </React.Fragment>
    )
  }
}
