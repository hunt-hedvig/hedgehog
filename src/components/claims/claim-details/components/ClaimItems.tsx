import {
  CategoryDropdown,
  FilterContainer,
  ItemTable,
} from 'components/pricing'
import { Paper } from 'components/shared/Paper'
import { SEARCH_ITEMS } from 'features/pricing/queries'
import {
  HeaderContainer,
  InputContainer,
  ItemPage,
  PropContainer,
} from 'features/pricing/styles'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Input } from 'semantic-ui-react'

export default class ClaimItems extends React.Component {
  public state = {
    activeCategory: '',
    activeQuery: '',
    activeFilters: [],
    activeDate: new Date().toJSON().slice(0, 10),
    usedDate: new Date().toJSON().slice(0, 10),
    offset: 0,
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
    switch (name) {
      case 'activeDate':
        if (this.isDateValid(value)) {
          this.setState({
            usedDate: new Date(Date.parse(value)).toJSON().slice(0, 10),
          })
        }
        break

      case 'activeCategory':
        this.setState({
          activeFilters: [],
          activeQuery: '',
        })
        break
    }

    this.setState({ [name]: value })
  }

  public render() {
    return (
      <Paper>
        <h3>Items</h3>

        <React.Fragment>
          <ItemPage>
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

                      <ItemTable items={items} date={this.state.usedDate} />
                      <p>
                        {items.products.length !== 0
                          ? 'Showing ' +
                            this.state.offset.toString() +
                            ' - ' +
                            Math.min(
                              items.products.length,
                              this.state.offset + 5,
                            ).toString() +
                            (items.products.length >= 5
                              ? ' out of ' + items.products.length.toString()
                              : '')
                          : 'No items to show'}
                      </p>
                    </div>
                  )
                }}
              </Query>
            </HeaderContainer>
          </ItemPage>
        </React.Fragment>
      </Paper>
    )
  }
}

export { ClaimItems }
