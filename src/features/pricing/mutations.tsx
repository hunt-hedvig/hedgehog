import gql from 'graphql-tag'

export const ADD_ITEM = gql`
  mutation AddIventoryItem($item: InventoryItemInput!) {
    addInventoryItem(item: $item)
  }
`

export const REMOVE_ITEM = gql`
  mutation RemoveIventoryItem($inventoryItemId: ID!) {
    removeInventoryItem(inventoryItemId: $inventoryItemId)
  }
`
