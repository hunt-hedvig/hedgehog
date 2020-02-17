// @ts-nocheck
import React from 'react'
import { Button, Dropdown, Icon } from 'semantic-ui-react'
import { EOrder } from '../../tickets/types'
import { IToolbarItem } from '../types'

export class ToolbarItem extends React.Component<IToolbarItem, {}> {
  public handleClick = () => {
    this.props.behaviors.onClicked(this.props.id)
  }

  public handleChange = (event, { value }) => {
    this.props.behaviors.handleChange(this.props.id, value)
  }

  public render() {
    let item
    switch (this.props.itemType) {
      case 'sortingButton':
        {
          item = (
            <Button
              basic
              active={this.props.active}
              primary={this.props.primary}
              onClick={this.handleClick}
              icon
              size="small"
              labelPosition="right"
            >
              <Icon name={this.getButtonIcon(this.props.caret)} />
              {this.props.label}
            </Button>
          )
        }
        break
      case 'button':
        {
          item = (
            <Button
              basic
              active={this.props.active}
              primary={this.props.primary}
              onClick={this.handleClick}
              size="small"
            >
              {this.props.label}
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
    return <>{item}</>
  }

  private getButtonIcon = (caret): string => {
    if (caret == null) {
      return ''
    }
    switch (caret.direction) {
      case EOrder.ASC:
        return 'caret up'
      case EOrder.DESC:
        return 'caret down'
      default:
        return ''
    }
  }
}
