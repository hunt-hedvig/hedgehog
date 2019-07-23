import React from 'react'
import styled from 'react-emotion'
import { Grid } from 'semantic-ui-react'
import { ToolbarItem } from './item/toolbarItem'
import { IToolbar } from './types'

const ToolbarCss = styled('div')({
  background: 'white',
  boxShadow: '1px 1px 5px lightgray',
  marginBottom: '3em',
  padding: '0',
})

export class Toolbar extends React.Component<IToolbar, {}> {
  public render() {
    const toolbarItems = this.props.items.map((item) => (
      <Grid.Column key={item.id}>
        <ToolbarItem key={item.id} {...item} />
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
