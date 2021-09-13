import React from 'react'
import { ClaimItemValuation } from 'types/generated/graphql'
import { DiscardChip } from './components/DiscardChip'
import { InputChip } from './components/InputChip'

export const CustomValuationChip: React.FC<{
  itemFamilyId: string
  customValuationAmount: string
  customValuationCurrency: string
  setCustomValuationAmount: React.EventHandler<any>
  valuation: ClaimItemValuation | null
}> = ({
  customValuationAmount,
  customValuationCurrency,
  setCustomValuationAmount,
  valuation,
}) => {
  return (
    <>
      <InputChip
        value={customValuationAmount}
        currency={customValuationCurrency}
        placeholder={
          valuation?.valuationRule?.valuationType === 'MARKET_PRICE'
            ? 'Add valuation'
            : 'Custom valuation'
        }
        onChange={({ target: { value } }) => setCustomValuationAmount(value)}
      />
      {customValuationAmount !== '' && (
        <DiscardChip onClick={() => setCustomValuationAmount('')} />
      )}
    </>
  )
}
