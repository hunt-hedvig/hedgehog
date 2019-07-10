import React from 'react'
import { Button, Dropdown } from 'semantic-ui-react'
import { EOrder } from '../../tickets/types'
import { IToolbarItem } from '../types'

class ToolbarItem extends React.Component<IToolbarItem, {}> {
  public handleClick = () => {
    this.props.behaviors.onClicked(this.props.id)
  }

  public handleChange = (event, { value }) => {
    this.props.behaviors.handleChange(this.props.id, value)
  }

  public render() {
    let caret = null
    if (this.props.caret) {
      caret =
        this.props.caret.direction === EOrder.DESC ? (
          <i className={'fas fa-caret-down'} />
        ) : (
          <i className={'fas fa-caret-up'} />
        )
    }

    let item
    switch (this.props.itemType) {
      case 'button':
        {
          item = (
            <Button
              basic
              active={this.props.active}
              primary={this.props.primary}
              onClick={this.handleClick}
            >
              {this.props.label} {caret}
            </Button>
          )
        }
        break
      case 'dropdown':
        {
          item = (
            <span>
              {this.props.label}
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
