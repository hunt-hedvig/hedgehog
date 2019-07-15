import { CategoryDropdown, ItemTable, SearchInput } from 'components/pricing'
import { ListPage } from 'components/shared'
import { HeaderContainer, InputContainer } from 'features/pricing/styles'
import * as React from 'react'
import { Header } from 'semantic-ui-react'

export default class Pricing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeCategory: '',
      activeQuery: '',
      activeDate: new Date().toJSON().slice(0, 10),
      activeFilters: [],

      categoryData: [{ key: 1, text: 'None', value: 1 }],
      itemData: { products: [], suggestions: [] },
      priceData: {},
    }

    this.handleChange = this.handleChange.bind(this)
    this.addFilter = this.addFilter.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.loadItems = this.loadItems.bind(this)
  }

  public loadItems(data) {
    this.setState({ itemData: data.items })
  }
  public handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }
  public addFilter(e, itemRow, categoryRow) {
    this.setState({
      activeFilters: [
        ...this.state.activeFilters,
        { name: itemRow, category: categoryRow.name },
      ],
    })
  }
  public removeFilter(e, theFilter) {
    this.setState({
      activeFilters: this.state.activeFilters.filter(
        (filter) => filter.category !== theFilter.category,
      ),
    })
  }

  public render() {
    return (
      <ListPage>
        <React.Fragment>
          <HeaderContainer>
            <Header size="huge">Pricing</Header>
          </HeaderContainer>

          <InputContainer>
            <CategoryDropdown
              value={this.state.activeCategory}
              handle={this.handleChange}
            />

            <SearchInput
              value={this.state.activeQuery}
              handle={this.handleChange}
              loader={this.loadItems}
              category={this.state.activeCategory}
              filters={this.state.activeFilters}
            />
          </InputContainer>

          <ItemTable items={this.state.itemData} />
        </React.Fragment>
      </ListPage>
    )
  }
}
