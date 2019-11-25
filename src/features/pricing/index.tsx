import {
  CategoryDropdown,
  FilterContainer,
  ItemTable,
} from 'components/pricing'
import { ListPage } from 'components/shared'
import { format } from 'date-fns'
import { SEARCH_ITEMS } from 'features/pricing/queries'
import {
  HeaderContainer,
  InputContainer,
  PropContainer,
} from 'features/pricing/styles'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Dropdown, Header, Icon, Input } from 'semantic-ui-react'

export default class Pricing extends React.Component {
  public state = {
    activeCategory: '',
    activeCategoryName: '',
    activeQuery: '',
    activeFilters: [],
    activeDate: format(new Date(), 'yyyy-MM-dd'),
    usedDate: format(new Date(), 'yyyy-MM-dd'),
    offset: 0,
    batchSize: 5,
  }

  public addFilter = (event, itemRow, categoryRow) => {
    this.setState((state) => {
      return {
        activeFilters: [
          ...state.activeFilters,
          { value: itemRow, name: categoryRow.name },
        ],
        offset: 0,
      }
    })
  }

  public removeFilter = (event, filterRow) => {
    this.setState((state) => {
      return {
        activeFilters: state.activeFilters.filter(
          (e) => e.name !== filterRow.name,
        ),
        offset: 0,
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

  public changePage = (steps) => {
    this.setState((prevState) => {
      return {
        offset: prevState.offset + steps,
      }
    })
  }

  public switchCategory = (categoryName, categoryValue) => {
    // tslint:disable-next-line:no-console
    console.log(categoryValue)
    this.setState({
      activeFilters: [],
      activeQuery: '',
      offset: 0,
    })

    this.setState({ activeCategory: categoryValue })
    this.setState({ activeCategoryName: categoryName })
  }

  public handleChange = (event, { name, value }) => {
    switch (name) {
      case 'activeDate':
        if (this.isDateValid(value)) {
          this.setState({
            usedDate: new Date(Date.parse(value)).toJSON().slice(0, 10),
            offset: 0,
          })
        }
        break
      case 'activeCategory':
        this.setState({
          activeFilters: [],
          activeQuery: '',
          offset: 0,
        })
        this.setState({ activeCategoryName: event.target.textContent })
        break
    }

    this.setState({ [name]: value })
  }

  public render() {
    return (
      <React.Fragment>
        <ListPage>
          {!('minimal' in this.props) ? (
            <HeaderContainer>
              <Header size="huge">Pricing</Header>
            </HeaderContainer>
          ) : null}

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
                const allItems =
                  data && Object.keys(data).length !== 0
                    ? data.items
                    : { products: [], suggestions: [] }

                const items =
                  data && Object.keys(allItems).length !== 0
                    ? {
                        products: allItems.products.slice(
                          this.state.offset,
                          this.state.offset + this.state.batchSize,
                        ),
                        suggestions: allItems.suggestions,
                      }
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
                      date={this.state.usedDate}
                      category={{
                        id: this.state.activeCategory,
                        name: this.state.activeCategoryName,
                      }}
                      selectionHandle={
                        'selectionHandle' in this.props
                          ? this.props.selectionHandle
                          : null
                      }
                    />

                    <div style={{ float: 'left' }}>
                      <p>
                        {items.products.length !== 0
                          ? 'Showing ' +
                            this.state.offset.toString() +
                            ' - ' +
                            Math.min(
                              allItems.products.length,
                              this.state.offset + this.state.batchSize,
                            ).toString() +
                            (allItems.products.length >= this.state.batchSize
                              ? ' out of ' + allItems.products.length.toString()
                              : '')
                          : 'No items to show'}
                      </p>
                    </div>

                    <div
                      style={{
                        float: 'left',
                        marginLeft: '0.9em',
                      }}
                    >
                      <Icon
                        link
                        name="arrow alternate circle left"
                        style={{
                          display:
                            items.products.length === 0 ||
                            this.state.offset - this.state.batchSize < 0
                              ? 'none'
                              : 'inline-block',
                        }}
                        onClick={() => this.changePage(-this.state.batchSize)}
                      />
                      <Icon
                        link
                        name="arrow alternate circle right"
                        style={{
                          display:
                            items.products.length === 0 ||
                            this.state.offset + this.state.batchSize >=
                              allItems.products.length
                              ? 'none'
                              : 'inline-block',
                        }}
                        onClick={() => this.changePage(this.state.batchSize)}
                      />
                    </div>

                    <div style={{ float: 'right' }}>
                      <p
                        style={{
                          display: 'inline-block',
                          marginRight: '0.5em',
                        }}
                      >
                        Items per page:
                      </p>
                      <Dropdown
                        value={this.state.batchSize}
                        name="batchSize"
                        onChange={this.handleChange}
                        options={[
                          { key: 5, text: '5', value: 5 },
                          { key: 10, text: '10', value: 10 },
                          { key: 25, text: '25', value: 25 },
                          { key: 50, text: '50', value: 50 },
                          { key: 100, text: '100', value: 100 },
                        ]}
                      />
                    </div>
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
