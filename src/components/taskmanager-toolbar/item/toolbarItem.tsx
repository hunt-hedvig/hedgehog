import React from 'react'
// import styled from 'react-emotion'
// import { colors } from '@hedviginsurance/brand'
import { Dropdown, Button } from 'semantic-ui-react'

class ToolbarItem extends React.Component {
  public handleClick = () => {
    this.props.onItemClicked(this.props.id)
  }

  public handleChange = (event, { value }) => {
    this.props.handleChange(this.props.id, value)
  }

  public render() {
    let caret = null
    if (this.props.caret) {
      if (this.props.caretDirection === 'DESC') {
        caret = <i className={'fas fa-caret-down'} />
      } else {
        caret = <i className={'fas fa-caret-up'} />
      }
    }

    var item
    switch (this.props.itemType) {
      case 'button':
        {
          item = (
            <Button
              basic
              active={this.props.isActive}
              primary={this.props.primary}
              onClick={this.handleClick}
            >
              {this.props.children} {caret}
            </Button>
          )
        }
        break
      case 'dropdown':
        {
          item = (
            <span>
              {this.props.children}
              <Dropdown
                inline
                options={this.props.options}
                defaultValue={
                  this.props.options[this.props.options.length - 1].value
                }
                onChange={this.handleChange}
              />
            </span>
          )
        }
        break
      default:
        item = null
        break
    }

    return <React.Fragment>{item}</React.Fragment>
  }
}

export default ToolbarItem
