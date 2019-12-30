import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

interface IRedirecterProps {
  route: string
  redirectText: string
}

interface IRedirecterState {
  redirect: boolean
}

export class Redirector extends React.Component<
  IRedirecterProps,
  IRedirecterState
> {
  public render() {
    return (
      <>
        <Link to={this.props.route} target="_blank">
          <Button>{this.props.redirectText}</Button>
        </Link>
      </>
    )
  }
}
