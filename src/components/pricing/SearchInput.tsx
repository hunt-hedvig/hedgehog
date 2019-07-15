import { SEARCH_ITEMS } from 'features/pricing/queries'
import * as React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { Form, Input } from 'semantic-ui-react'

export default class SearchInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  public render() {
    return (
      <ApolloConsumer>
        {(client) => (
          <Form
            onSubmit={async () => {
              this.setState({ loading: true })
              const { data } = await client.query({
                query: SEARCH_ITEMS,
                variables: {
                  payload: {
                    category: this.props.category,
                    query: this.props.value,
                    filters: this.props.filters,
                  },
                },
              })

              this.props.loader(data)
              this.setState({ loading: false })
            }}
          >
            <Input
              icon="search"
              name="activeQuery"
              onChange={this.props.handle}
              value={this.props.value}
              placeholder="Search..."
              loading={this.state.loading}
            />
          </Form>
        )}
      </ApolloConsumer>
    )
  }
}
