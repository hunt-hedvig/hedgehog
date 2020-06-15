import {
  GetItemCategoriesQueryHookResult,
  ItemCategory,
  ItemCategoryKind,
  useGetItemCategoriesQuery,
} from 'api/generated/graphql'

type GetItemCategoriesReturnTuple = [
  ReadonlyArray<ItemCategory>,
  GetItemCategoriesQueryHookResult,
]

export const useGetItemCategories = (
  kind: ItemCategoryKind,
  parentId: string | null,
): GetItemCategoriesReturnTuple => {
  const queryResult = useGetItemCategoriesQuery({
    variables: {
      kind,
      parentId,
    },
  })
  const itemCategories = (queryResult.data?.itemCategories ??
    []) as ReadonlyArray<ItemCategory>
  return [itemCategories, queryResult]
}
