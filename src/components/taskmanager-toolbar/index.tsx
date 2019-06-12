import React from 'react'
import styled from 'react-emotion'
import ToolbarItem from './item/ToolbarItem'

const ToolbarCss = styled('div')({
  background: 'white',
  boxShadow: '1px 1px 5px lightgray',
})

const ItemContainer = styled('ul')({
  listStyle: ' none',
  padding: '1em',
  display: 'flexbox',
  boxSizing: 'border-box',
})


// Props - ta in vilka knappar som ska finnas
// samt funktionerna som ska mappas till dem

class Toolbar extends React.Component {
  public render() {

    const toolbarItems = this.props.items.map((item) => (
      <ToolbarItem 
        key={item.id} 
        onItemClicked={item.clicked} 
        id={item.id} 
        caret={item.hasCaret} 
        caretDirection={item.caretDirection}
        isActive={item.isActive}>
        {item.label} 
      </ToolbarItem>
    ))
    return (
      <ToolbarCss>
        <ItemContainer>{toolbarItems}</ItemContainer>
      </ToolbarCss>
    )
  }
}


export default Toolbar
