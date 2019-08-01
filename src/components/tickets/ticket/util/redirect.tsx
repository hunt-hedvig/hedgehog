import React from 'react'
import { Redirect } from 'react-router-dom'
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
  public state = {
    redirect: false,
  }

  public render() {
    return (
      <>
        {this.state.redirect ? <Redirect push to={this.props.route} /> : null}
        <Button secondary onClick={this.handleClick}>
          {this.props.redirectText}
        </Button>
      </>
    )
  }

  private handleClick = (event) => {
    event.preventDefault()
    this.setState({ redirect: true })
  }
}
