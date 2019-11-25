import { GET_CATEGORIES } from 'features/pricing/queries'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Dropdown } from 'semantic-ui-react'

export class EditableCategoryDropdown extends React.Component {
  //TODO: Pass clean category names from item-service instead of parsing here
  public parseCategoryName(text) {
    return text.split(' > ')[text.split(' > ').length - 1]
  }

  public render() {
    const { searchQuery, value } = this.props

    return (
      <Query query={GET_CATEGORIES}>
        {({ loading, error, data }) => {
          return (
            <Dropdown
              fluid
              disabled={this.props.locked}
              onChange={this.props.handleChange}
              onSearchChange={this.props.handleSearchChange}
              options={
                loading || error
                  ? [{ key: 1, text: 'None', value: 1 }]
                  : data.categories.map((item) => {
                      return {
                        key: item.id,
                        text: this.parseCategoryName(item.name),
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
