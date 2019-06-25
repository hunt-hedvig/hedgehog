import React from 'react'
import styled from 'react-emotion'
import { colors } from '@hedviginsurance/brand'
import { Dropdown, Button } from 'semantic-ui-react'


class ToolbarItem extends React.Component {

  public handleClick = () => {
    this.props.onItemClicked(this.props.id)
  }

  public handleChange = (event, {value}) => {
    this.props.handleChange(this.props.id, value)
  }


  public render() {
    const bgColor = (this.props.isActive) ? colors.LIGHT_GRAY : 'white'
    const txtColor = (this.props.isActive) ? 'black' : 'black'
    
    // const ToolbarItemCss = styled('li')`
    //   display: inline;
    //   border: 1px solid lightgray;
    //   cursor: pointer;
    //   margin: 0 0.25em;
    //   padding: 0.5em;
    //   background-color: ${bgColor};
    //   color: ${txtColor},
    // `

    let caret = null
    if (this.props.caret) {
      if (this.props.caretDirection === 'DESC') {
        caret = <i className={'fas fa-caret-down'} />
      }
      else {
        caret = <i className={'fas fa-caret-up'} />
      }
    }

    var item
    switch (this.props.inputType) {
      case "button":{
         item = (
           <Button 
             basic
             active={this.props.isActive}
             onClick={this.handleClick}>
               {this.props.children} {caret} 
          </Button>
        )
      }  break;
      case "dropdown":{
         item = (
          <span>{this.props.children}
          <Dropdown
            inline
            options={this.props.options}
            defaultValue={this.props.options[this.props.options.length-1].value}
            onChange={this.handleChange}
                         />
           </span>
         )
      }  break;
      default:
        item = null 
        break;
    }



    return (
      <li>
      {item} 
      </li>
       // <ToolbarItemCss onClick={this.handleClick}>
       //    {this.props.children} {caret} 
       //  </ToolbarItemCss>
    )
  }

}





export default ToolbarItem
