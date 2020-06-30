import { ValuationRule } from '../api/generated/graphql'

export const getValuationExplanation = (
  valuationRule: ValuationRule | null | undefined,
) => {
  if (valuationRule === undefined || valuationRule === null) {
    return null
  }

  const valuationName = valuationRule.valuationName
  const depreciation = (Number(valuationRule.depreciation) * 100).toString()
  const ageLimit = valuationRule.ageLimit

  return `Considering the item belongs to '${valuationName}'
  it has been depreciated with ${depreciation} since it is
  at least ${ageLimit} year${ageLimit > 1.0 ? 's' : ''}`
}
