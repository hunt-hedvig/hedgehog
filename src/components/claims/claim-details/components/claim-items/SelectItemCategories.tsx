import * as React from 'react'
import Select from 'react-select'
import { ItemCategoryKind } from '../../../../../api/generated/graphql'
import { useGetItemCategories } from '../../../../../graphql/use-get-item-categories'

const customStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    marginTop: '6px',
    background: 'rgba(0, 0, 0, 0.0)',
    // match with the menu
    borderRadius: 0,
    border: '0px',
    borderBottom: isFocused ? '1px solid #0f007a' : '1px solid #999999',
    boxShadow: 'none',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    hyphens: 'auto',
    marginTop: 0,
    textAlign: 'left',
    wordWrap: 'break-word',
  }),
  valueContainer: (base) => ({
    ...base,
    paddingLeft: '0px',
    overflow: 'visible',
  }),
  multiValueRemove: (base) => ({ ...base, display: 'none' }),
  multiValue: (base) => ({
    ...base,
    paddingLeft: '5px',
    paddingRight: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    border: '1px solid #5b30f5',
    borderRadius: 20,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#5b30f5',
    fontWeight: 'bold',
  }),
}

const customFilter = (option, rawInput) => {
  const words = rawInput.split(' ')
  return words.reduce(
    (acc, cur) =>
      acc && option.data.searchTerms.toLowerCase().includes(cur.toLowerCase()),
    true,
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
  setSelectedItemCategories
}> = ({ selectedItemCategories, setSelectedItemCategories }) => {
  const currentItemCategory = selectedItemCategories?.slice(-1).pop()

  const [
    newItemCategories,
    { loading: loadingNewItemCategories },
  ] = useGetItemCategories(
    currentItemCategory?.nextKind ?? ItemCategoryKind.Family,
    currentItemCategory?.id ?? null,
  )

  return (
    <Select
      closeMenuOnSelect={false}
      isMulti
      placeholder={'Bike, Phone, Pills...'}
      filterOption={customFilter}
      styles={customStyles}
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
        loadingNewItemCategories
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
