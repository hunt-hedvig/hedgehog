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
      itemId
      upper
      mean
      lower
    }
  }
`

export const GET_INVENTORY = gql`
  query Inventory($claimId: ID!) {
    inventory(claimId: $claimId) {
      inventoryItemId
      claimId
      itemName
      categoryName
      categoryId
      value
      source
      upperRange
      lowerRange
      itemId
    }
  }
`

export const GET_INVENTORY_ITEM_FILTERS = gql`
  query InventoryItemFilters($inventoryItemId: String!) {
    inventoryItemFilters(inventoryItemId: $inventoryItemId) {
      name
      value
    }
  }
`

export const GET_ALL_FILTERS = gql`
  query Filters($categoryId: String!) {
    filters(categoryId: $categoryId) {
      name
      items
      others
    }
  }
`
