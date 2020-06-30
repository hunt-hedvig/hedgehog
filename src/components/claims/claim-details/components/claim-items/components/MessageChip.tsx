import {
  MonetaryAmountV2,
  UpsertClaimItemInput,
  ValuationRule,
} from 'api/generated/graphql'
import React from 'react'
import { useCanValuateClaimItem } from '../../../../../../graphql/use-can-valuate-claim-item'
import { useGetClaimItemValuation } from '../../../../../../graphql/use-get-claim-item-valuation'
import {
  DiscardChip,
  InfoChip,
  InputChip,
  MarketValuationChip,
  NoValuationChip,
  ValuationChip,
} from './chips'
import { ExplanationPopover } from './styles'

export const MessageChip: React.FC<{
  formData: UpsertClaimItemInput
  setAutoValuation: React.EventHandler<any>
  customValuation: string
  setCustomValuation: React.EventHandler<any>
  defaultCurrency: string
}> = ({
  formData,
  setAutoValuation,
  customValuation,
  setCustomValuation,
  defaultCurrency,
}) => {
  const {
    itemFamilyId,
    itemTypeId,
    dateOfPurchase,
    purchasePriceAmount: price,
    purchasePriceCurrency: currency,
  } = formData

  const [
    valuationStatus,
    { loading: loadingValuationStatus },
  ] = useCanValuateClaimItem('SE_APARTMENT_RENT', itemFamilyId, itemTypeId)

  const [valuation, { loading: loadingValuation }] = useGetClaimItemValuation(
    price ?? 0,
    itemFamilyId,
    'SE_APARTMENT_RENT',
    dateOfPurchase,
    itemTypeId,
    null,
  )

  React.useEffect(() => {
    setAutoValuation(valuation?.depreciatedValue)
  }, [valuation?.depreciatedValue])

  const priceAndDateAvailable = price && dateOfPurchase
  const canValuateClaimItem = !!itemFamilyId && !!valuationStatus?.canValuate
  const valuationType = valuation?.valuationRule?.valuationType ?? ''
  const marketValuation = valuationType === 'MARKET_PRICE'

  const formattedValuation: MonetaryAmountV2 = {
    amount: loadingValuation
      ? '...'
      : valuation?.depreciatedValue?.toString() ?? '-',
    currency: currency ?? defaultCurrency,
  }

  React.useEffect(() => {
    setCustomValuation('')
  }, [itemFamilyId, itemTypeId])

  const getExplanation = (valuationRule: ValuationRule | null | undefined) => {
    if (typeof valuationRule === 'undefined' || valuationRule === null) {
      return null
    }

    const valuationName = valuationRule?.valuationName
    const depreciation = (Number(valuationRule?.depreciation) * 100).toString()
    const ageLimit = valuationRule?.ageLimit

    return (
      "Considering the item belongs to '" +
      valuationName +
      "' it has been depreciated with " +
      depreciation +
      '% since it is at least ' +
      ageLimit +
      ' year' +
      (ageLimit > 1.0 ? 's' : '') +
      ' old.'
    )
  }

  const getCurrentChip = () => {
    if (canValuateClaimItem && priceAndDateAvailable && marketValuation) {
      return <MarketValuationChip />
    }

    if (canValuateClaimItem && priceAndDateAvailable) {
      return (
        <ExplanationPopover
          contents={<>{getExplanation(valuation?.valuationRule)}</>}
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

    if (itemFamilyId && !loadingValuationStatus) {
      return <NoValuationChip />
    }
  }

  return (
    <>
      {getCurrentChip()}
      {itemFamilyId && (
        <>
          <InputChip
            value={customValuation}
            currency={currency ?? defaultCurrency}
            placeholder={
              valuationType === 'MARKET_PRICE'
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
