import {
  CanValuateClaimItem,
  ClaimItemValuation,
  MonetaryAmountV2,
} from 'api/generated/graphql'
import React from 'react'
import { getValuationExplanation } from '../../../../../../../utils/claim-item'
import { ExplanationPopover } from '../styles'
import { InfoChip } from './components/InfoChip'
import { MarketValuationChip } from './components/MarketValuationChip'
import { NoValuationChip } from './components/NoValuationChip'
import { ValuationChip } from './components/ValuationChip'

export const MessageChip: React.FC<{
  valuation: ClaimItemValuation | undefined
  valuationStatus: CanValuateClaimItem | undefined
  itemFamilyId: string
  price: number | undefined | null
  currency: string
  dateOfPurchase: string
  customValuation: string
}> = ({
  valuation,
  valuationStatus,
  itemFamilyId,
  price,
  currency,
  dateOfPurchase,
  customValuation,
}) => {
  const loadingValuation = valuation === undefined
  const priceAndDateAvailable = price && dateOfPurchase.length === 10
  const canValuateClaimItem = !!itemFamilyId && !!valuationStatus?.canValuate
  const valuationType = valuation?.valuationRule?.valuationType ?? ''
  const marketValuation = valuationType === 'MARKET_PRICE'
  const formattedValuation: MonetaryAmountV2 = {
    amount: valuation?.depreciatedValue?.toString() ?? '...',
    currency,
  }

  if (canValuateClaimItem && priceAndDateAvailable && marketValuation) {
    return <MarketValuationChip />
  }

  if (canValuateClaimItem && priceAndDateAvailable) {
    return (
      <ExplanationPopover
        contents={<>{getValuationExplanation(valuation?.valuationRule)}</>}
      >
        <ValuationChip
          valuation={formattedValuation}
          ignored={customValuation !== ''}
        />
      </ExplanationPopover>
    )
  }

  if (canValuateClaimItem) {
    return <InfoChip />
  }

  if (itemFamilyId && !loadingValuation) {
    return <NoValuationChip />
  }

  return <></>
}
