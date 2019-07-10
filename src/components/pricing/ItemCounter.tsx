import * as React from 'react'

export default class ItemCounter extends React.Component {
  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div>
        {this.props.items.length !== 0 ? (
          <p style={{ color: '#444' }}>
            Showing {this.props.offset} -{' '}
            {20 + this.props.offset > this.props.items.length
              ? this.props.items.length
              : 20 + this.props.offset}{' '}
            of {this.props.items.length} results
          </p>
        ) : (
          <p style={{ color: '#444' }}> No items to show </p>
        )}
      </div>
    )
  }
}
