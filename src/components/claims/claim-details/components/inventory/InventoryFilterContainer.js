import * as React from 'react'
import { PropContainer, SubHeaderContainer } from 'features/pricing/styles'
import { Dropdown, Header, Label } from 'semantic-ui-react'

export class InventoryFilterContainer extends React.Component {
  isFilterActive = (value, name) => {
    return this.props.activeFilters.some((activeFilter) => {
      return value === activeFilter.value && activeFilter.name === name
    })
  }
  render() {
    return (
      <PropContainer>
        {this.props.activeFilters.length !== 0 ? (
          <React.Fragment>
            <SubHeaderContainer>
              <Header size="small">Selected Filters</Header>
            </SubHeaderContainer>

            {this.props.activeFilters.map((filter) => (
              <Label
                as="a"
                basic
                color="blue"
                size="mini"
                key={filter.value + filter.name}
                onClick={(e) =>
                  this.props.removeFilter({
                    name: filter.name,
                    value: filter.value,
                  })
                }
              >
                {filter.value}
                <Label.Detail>({filter.name})</Label.Detail>
              </Label>
            ))}
          </React.Fragment>
        ) : (
          <SubHeaderContainer />
        )}

        {this.props.filters.length !== 0 ? (
          <SubHeaderContainer>
            <Header size="small">Available Filters</Header>
          </SubHeaderContainer>
        ) : (
          <SubHeaderContainer />
        )}

        {this.props.filters.map((filterRow) => (
          <Label.Group
            size="mini"
            key={filterRow.name}
            style={{ marginBottom: '10px' }}
          >
            {filterRow.items.map((itemRow) => (
              <Label
                color={
                  this.isFilterActive(itemRow, filterRow.name) ? 'grey' : 'blue'
                }
                as="a"
                key={itemRow + filterRow.name}
                onClick={(e) => {
                  if (!this.isFilterActive(itemRow, filterRow.name)) {
                    this.props.addFilter({
                      name: filterRow.name,
                      value: itemRow,
                    })
                  }
                }}
              >
                {itemRow}
                <Label.Detail>({filterRow.name})</Label.Detail>
              </Label>
            ))}

            {filterRow.others.length !== 0 ? (
              <Dropdown text="">
                <Dropdown.Menu>
                  {filterRow.others.map((itemRow) => (
                    <Dropdown.Item
                      disabled={this.isFilterActive(itemRow, filterRow.name)}
                      text={itemRow + ' (' + filterRow.name + ')'}
                      key={itemRow + filterRow.name}
                      onClick={(e) =>
                        this.props.addFilter({
                          name: filterRow.name,
                          value: itemRow,
                        })
                      }
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              ''
            )}
          </Label.Group>
        ))}
      </PropContainer>
    )
  }
}
