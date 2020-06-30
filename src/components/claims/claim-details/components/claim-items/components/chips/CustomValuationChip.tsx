import { ClaimItemValuation, UpsertClaimItemInput } from 'api/generated/graphql'
import React from 'react'
import { DiscardChip } from './components/DiscardChip'
import { InputChip } from './components/InputChip'

export const CustomValuationChip: React.FC<{
  request: UpsertClaimItemInput
  customValuation: string
  customValuationCurrency: string
  setCustomValuation: React.EventHandler<any>
  valuation: ClaimItemValuation | undefined
}> = ({
  request,
  customValuation,
  customValuationCurrency,
  setCustomValuation,
  valuation,
}) => {
  return (
    <>
      {request.itemFamilyId && (
        <>
          <InputChip
            value={customValuation}
            currency={customValuationCurrency}
            placeholder={
              valuation?.valuationRule?.valuationType === 'MARKET_PRICE'
                ? 'Add valuation'
                : 'Custom valuation'
            }
            onChange={({ target: { value } }) => setCustomValuation(value)}
          />
          {customValuation !== '' && (
            <DiscardChip onClick={() => setCustomValuation('')} />
          )}
        </>
      )}
    </>
  )
}
