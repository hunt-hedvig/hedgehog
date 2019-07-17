import gql from 'graphql-tag'

export const GET_CATEGORIES = gql`
  {
    categories {
      id
      name
    }
  }
`

export const SEARCH_ITEMS = gql`
  query Items($payload: Payload!) {
    items(payload: $payload) {
      products {
        id
        name
      }
      suggestions {
        name
        items
        others
      }
    }
  }
`

export const GET_PRICES = gql`
  query Prices($date: String!, $ids: [String!]!) {
    prices(date: $date, ids: $ids) {
      id
      upper
      mean
      lower
    }
  }
`
