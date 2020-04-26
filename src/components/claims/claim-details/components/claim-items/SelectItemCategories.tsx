import * as React from 'react'
import CreatableSelect from 'react-select/creatable'
import { ItemCategoryKind } from '../../../../../api/generated/graphql'
import { useGetItemCategories } from '../../../../../graphql/use-get-item-categories'
import { SelectItemCategoriesStyle } from './SelectItemCategoriesStyle'

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
const customOptionsMessage = () => {
  return <>No tags</>
}

export interface SelectedItemCategory {
  nextKind: ItemCategoryKind
  id: string
  parentId: string | null
  displayName: string
}

export const SelectItemCategories: React.FC<{
  selectedItemCategories: SelectedItemCategory[]
  setSelectedItemCategories
}> = ({ selectedItemCategories, setSelectedItemCategories }) => {
  const currentItemCategory = selectedItemCategories?.slice(-1).pop()
  const noMoreItemCategories =
    !currentItemCategory?.nextKind && selectedItemCategories.length !== 0
  const noSelectedCategories = selectedItemCategories.length === 0

  const [
    newItemCategories,
    { loading: loadingNewItemCategories },
  ] = useGetItemCategories(
    currentItemCategory?.nextKind ?? ItemCategoryKind.Family,
    currentItemCategory?.id ?? null,
  )

  return (
    <CreatableSelect
      closeMenuOnSelect={false}
      isMulti
      placeholder={''}
      filterOption={customFilter}
      styles={SelectItemCategoriesStyle}
      noOptionsMessage={customOptionsMessage}
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
      onChange={(selections) => {
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
