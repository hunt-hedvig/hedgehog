import { MonetaryAmountV2, UpsertClaimItemInput } from 'api/generated/graphql'
import { useCanEvaluate } from 'graphql/use-can-evaluate'
import { useGetEvaluation } from 'graphql/use-get-evaluation'
import React from 'react'
import {
  DiscardChip,
  InfoChip,
  InputChip,
  MarketValuationChip,
  NoValuationChip,
  ValuationChip,
} from './chips'

export const MessageChip: React.FC<{
  formData: UpsertClaimItemInput
  customValuation: string
  setCustomValuation: React.EventHandler<any>
}> = ({ formData, customValuation, setCustomValuation }) => {
  const {
    itemFamilyId,
    itemTypeId,
    dateOfPurchase,
    purchasePriceAmount: price,
    purchasePriceCurrency: currency,
  } = formData

  const [
    evaluationStatus,
    { loading: loadingEvaluationStatus },
  ] = useCanEvaluate('SE_APARTMENT_RENT', itemFamilyId, itemTypeId)

  const [evaluation, { loading: loadingEvaluation }] = useGetEvaluation(
    price ?? 0,
    itemFamilyId,
    'SE_APARTMENT_RENT',
    dateOfPurchase,
    itemTypeId,
    null,
  )

  const priceAndDateAvailable = price && dateOfPurchase
  const canEvaluate = !!itemFamilyId && !!evaluationStatus?.canEvaluate
  const evaluationType = evaluation?.evaluationRule?.evaluationType ?? ''
  const marketEvaluation = evaluationType === 'MARKET_PRICE'

  const valuation: MonetaryAmountV2 = {
    amount: loadingEvaluation
      ? '...'
      : evaluation?.depreciatedValue?.toString() ?? '-',
    currency: currency ?? 'SEK',
  }

  React.useEffect(() => {
    setCustomValuation('')
  }, [itemFamilyId, itemTypeId])

  const getCurrentChip = () => {
    if (canEvaluate && priceAndDateAvailable && marketEvaluation) {
      return <MarketValuationChip />
    }

    if (canEvaluate && priceAndDateAvailable) {
      return (
        <ValuationChip valuation={valuation} ignored={customValuation !== ''} />
      )
    }

    if (canEvaluate) {
      return <InfoChip />
    }

    if (itemFamilyId && !loadingEvaluationStatus) {
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
            currency={currency ?? 'SEK'}
            placeholder={
              evaluationType === 'MARKET_PRICE'
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
