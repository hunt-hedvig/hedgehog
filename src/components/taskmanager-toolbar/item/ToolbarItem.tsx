import React from 'react'
import styled from 'react-emotion'
import { colors } from '@hedviginsurance/brand'


// const ToolbarItem = (props) => {

class ToolbarItem extends React.Component {



  public handleClick = () => {
    this.props.onItemClicked(this.props.id)
  }
  public render() {
    const bgColor = (this.props.isActive) ? colors.LIGHT_GRAY : 'white'
    const txtColor = (this.props.isActive) ? 'black' : 'black'
    
    // const ToolbarItemCss = styled('li')({
    //   display: 'inline',
    //   border: '1px solid lightgray',
    //   cursor: 'pointer',
    //   margin: '0 0.25em',
    //   padding: '0.5em',
    //   backgroundColor: bgColor,
    //   color: txtColor,
    // })

    const ToolbarItemCss = styled('li')`
      display: inline;
      border: 1px solid lightgray;
      cursor: pointer;
      margin: 0 0.25em;
      padding: 0.5em;
      background-color: ${bgColor};
      color: ${txtColor},
      &:hover {
        color: yellow;
      }
`


    let caret = null
    if (this.props.caret) {
      if (this.props.caretDirection === 'DESC') {
        caret = <i className={'fas fa-caret-down'} />
      }
      else {
        caret = <i className={'fas fa-caret-up'} />
      }
    }

    return (
      <ToolbarItemCss onClick={this.handleClick}>
        {this.props.children} {caret} 
      </ToolbarItemCss>
    )
  }
}

export default ToolbarItem
