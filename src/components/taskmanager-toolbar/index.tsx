import React from 'react'
import styled from 'react-emotion'
import ToolbarItem from './item/toolbarItem'

import { Grid } from 'semantic-ui-react'
import { IToolbar } from './types';

const ToolbarCss = styled('div')({
  background: 'white',
  boxShadow: '1px 1px 5px lightgray',
  marginBottom: '3em',
  padding: '0',
})


class Toolbar extends React.Component<IToolbar, {}> {
  public render() {
    const toolbarItems = this.props.items.map((item) => (
      <Grid.Column key={item.id + 'g'}>
        <ToolbarItem
          key={item.id}
          id={item.id}
          itemType={item.itemType}
          behaviors={item.behaviors}
          caret={item.caret}
          options={item.options}
          active={item.active}
          primary={item.primary}
          label={item.label}
        />
      </Grid.Column>
    ))

    return (
      <ToolbarCss>
        <Grid stackable columns={this.props.items.length}>
          <Grid.Row style={{ padding: '0.5em' }}>{toolbarItems}</Grid.Row>
        </Grid>
      </ToolbarCss>
    )
  }
}

export default Toolbar
