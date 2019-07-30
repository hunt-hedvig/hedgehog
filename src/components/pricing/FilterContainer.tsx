import { PropContainer, SubHeaderContainer } from 'features/pricing/styles'
import * as React from 'react'
import { Dropdown, Header, Icon, Label } from 'semantic-ui-react'

export class FilterContainer extends React.Component {
  public render() {
    return (
      <PropContainer>
        {this.props.filters.length !== 0 ? (
          <SubHeaderContainer>
            <Header size="small">Active Filters</Header>
          </SubHeaderContainer>
        ) : (
          <SubHeaderContainer />
        )}
        {this.props.filters.map((filterRow) => (
          <Label
            basic
            as="a"
            color="blue"
            key={filterRow.value + filterRow.name}
            onClick={(e) => this.props.removeFilter(e, filterRow)}
          >
            {filterRow.value}
            <Label.Detail>({filterRow.name})</Label.Detail>
            <Icon name="delete" />
          </Label>
        ))}

        {this.props.items.suggestions.length !== 0 ? (
          <SubHeaderContainer>
            <Header size="small">Suggested Filters</Header>
          </SubHeaderContainer>
        ) : (
          <SubHeaderContainer />
        )}

        {this.props.items.suggestions.map((categoryRow) => (
          <Label.Group color="blue" key={categoryRow.name}>
            {categoryRow.items.map((itemRow) => (
              <Label
                as="a"
                key={itemRow + categoryRow.name}
                onClick={(e) => this.props.addFilter(e, itemRow, categoryRow)}
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
                      key={itemRow + categoryRow.name}
                      onClick={(e) =>
                        this.props.addFilter(e, itemRow, categoryRow)
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
