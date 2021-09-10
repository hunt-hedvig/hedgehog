import { MainHeadline } from '@hedvig-ui'
import React from 'react'
import {
  useInsertItemCategoriesMutation,
  useInsertValuationRulesMutation,
} from 'types/generated/graphql'
import { TableInput } from './TableInput'

export const ItemizerComponent: React.FC = () => {
  const [insertItemCategories] = useInsertItemCategoriesMutation()
  const [insertValuationRules] = useInsertValuationRulesMutation()

  return (
    <>
      <MainHeadline>Itemizer</MainHeadline>
      <TableInput
        title="Valuation rules"
        headers={[
          'Name',
          'Age',
          'Type of Contract',
          'Item Family',
          'Item Type',
          'Valuation Type',
          'Depreciation',
        ]}
        onSubmit={(data, setValidity, setResetRequired) =>
          insertValuationRules({
            variables: { request: { valuationRulesString: data } },
          }).then(({ data: response }) => {
            setResetRequired(true)
            setValidity(response?.insertValuationRules ?? [])
          })
        }
      />
      <TableInput
        title="Item categories"
        headers={['Family', 'Type', 'Company', 'Brand', 'Model']}
        onSubmit={(data, setValidity, setResetRequired) =>
          insertItemCategories({
            variables: { request: { itemCategoriesString: data } },
          }).then(({ data: response }) => {
            setResetRequired(true)
            setValidity(response?.insertItemCategories ?? [])
          })
        }
      />
    </>
  )
}
