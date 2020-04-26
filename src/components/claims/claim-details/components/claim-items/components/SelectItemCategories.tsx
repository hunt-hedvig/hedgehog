import { ItemCategoryKind } from 'api/generated/graphql'
import { useGetItemCategories } from 'graphql/use-get-item-categories'
import * as React from 'react'
import CreatableSelect from 'react-select/creatable'
import { SelectItemCategoriesStyle } from '../styles/SelectItemCategoriesStyle'
import { SelectItemCategoriesPlaceholder } from './SelectItemCategoriesPlaceholder'

const customFilter = (option, rawInput) => {
  const words = rawInput.split(' ')
  return words.reduce(
    (acc, cur) =>
      acc &&
      (option.data?.searchTerms?.toLowerCase().includes(cur.toLowerCase()) ??
        true),
    true,
  )
}

const noOptionsMessage = (
  currentItemCategory: SelectedItemCategory | undefined,
  noMoreItemCategories: boolean,
) => {
  const nextKind = currentItemCategory?.nextKind?.toLowerCase()
  return (
    <>
      {nextKind
        ? `No ${nextKind}s`
        : noMoreItemCategories
        ? 'No more categories'
        : 'No result'}
    </>
  )
}

export interface SelectedItemCategory {
  nextKind: ItemCategoryKind
  id: string
  parentId: string | null
  displayName: string
}

export const SelectItemCategories: React.FC<{
  selectedItemCategories: SelectedItemCategory[]
  setSelectedItemCategories: React.Dispatch<
    React.SetStateAction<SelectedItemCategory[]>
  >
}> = ({ selectedItemCategories, setSelectedItemCategories }) => {
  const currentItemCategory = selectedItemCategories?.slice(-1).pop()
  const [
    newItemCategories,
    { loading: loadingNewItemCategories },
  ] = useGetItemCategories(
    currentItemCategory?.nextKind ?? ItemCategoryKind.Family,
    currentItemCategory?.id ?? null,
  )
  const placeholderSuggestion =
    newItemCategories
      .slice(0, 3)
      .map((itemCategory) => `${itemCategory.displayName}`)
      .join(', ') + '...'

  const noMoreItemCategories =
    !currentItemCategory?.nextKind && selectedItemCategories.length !== 0
  const noSelectedCategories = selectedItemCategories.length === 0
  const noNewItemCategories = newItemCategories.length === 0

  return (
    <CreatableSelect
      closeMenuOnSelect={false}
      isMulti
      placeholder={
        noMoreItemCategories || noNewItemCategories
          ? null
          : placeholderSuggestion
      }
      components={{ ValueContainer: SelectItemCategoriesPlaceholder }}
      filterOption={customFilter}
      styles={SelectItemCategoriesStyle}
      noOptionsMessage={() =>
        noOptionsMessage(currentItemCategory, noMoreItemCategories)
      }
      isValidNewOption={(rawInput) => {
        return !(
          noMoreItemCategories ||
          noSelectedCategories ||
          rawInput === ''
        )
      }}
      value={selectedItemCategories?.map((itemCategory) => {
        return {
          ...itemCategory,
          value: itemCategory?.id,
          label: itemCategory?.displayName,
        }
      })}
      onChange={(selections: any[]) => {
        setSelectedItemCategories(
          selections?.map(({ nextKind, id, parentId, displayName }) => {
            return { nextKind, id, parentId, displayName }
          }) ?? [],
        )
      }}
      options={
        loadingNewItemCategories || noMoreItemCategories
          ? []
          : newItemCategories.map((newItemCategory) => {
              return {
                ...newItemCategory,
                value: newItemCategory?.id,
                label: newItemCategory?.displayName,
                searchTerms: newItemCategory?.searchTerms,
              }
            })
      }
    />
  )
}
