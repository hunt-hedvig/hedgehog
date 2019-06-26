import React from 'react'
import styled from 'react-emotion'
import ToolbarItem from './item/toolbarItem'

import { Grid } from 'semantic-ui-react'

const ToolbarCss = styled('div')({
  background: 'white',
  boxShadow: '1px 1px 5px lightgray',
  marginBottom: '3em',
  padding: '0',
})

// Props - ta in vilka knappar som ska finnas
// samt funktionerna som ska mappas till dem
class Toolbar extends React.Component {
  public render() {
    const toolbarItems = this.props.items.map((item) => (
      <Grid.Column key={item.id + 'g'}>
        <ToolbarItem
          key={item.id}
          onItemClicked={item.clicked}
          id={item.id}
          caret={item.hasCaret}
          caretDirection={item.caretDirection}
          isActive={item.isActive}
          itemType={item.itemType}
          options={item.options}
          primary={item.primary}
          handleChange={item.handleChange}
        >
          {item.label}
        </ToolbarItem>
      </Grid.Column>
    ))

    return (
      <ToolbarCss>
        <Grid stackable columns={this.props.items.length}>
          <Grid.Row style={{ padding: '0.5em' }}>
            {toolbarItems}
            {/* <ItemContainer>{toolbarItems}</ItemContainer> */}
          </Grid.Row>
        </Grid>
      </ToolbarCss>
    )
  }
}

export default Toolbar
