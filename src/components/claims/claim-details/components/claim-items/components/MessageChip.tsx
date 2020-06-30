import {
  EvaluationRule,
  MonetaryAmountV2,
  UpsertClaimItemInput,
} from 'api/generated/graphql'
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

  React.useEffect(() => {
    setAutoValuation(evaluation?.depreciatedValue)
  }, [evaluation?.depreciatedValue])

  const priceAndDateAvailable = price && dateOfPurchase
  const canEvaluate = !!itemFamilyId && !!evaluationStatus?.canEvaluate
  const evaluationType = evaluation?.evaluationRule?.evaluationType ?? ''
  const marketEvaluation = evaluationType === 'MARKET_PRICE'

  const valuation: MonetaryAmountV2 = {
    amount: loadingEvaluation
      ? '...'
      : evaluation?.depreciatedValue?.toString() ?? '-',
    currency: currency ?? defaultCurrency,
  }

  React.useEffect(() => {
    setCustomValuation('')
  }, [itemFamilyId, itemTypeId])

  const getExplanation = (
    evaluationRule: EvaluationRule | null | undefined,
  ) => {
    if (typeof evaluationRule === 'undefined' || evaluationRule === null) {
      return null
    }

    const evaluationName = evaluationRule?.evaluationName
    const deprecitation = (
      Number(evaluationRule?.depreciation) * 100
    ).toString()
    const ageLimit = evaluationRule?.ageLimit

    return (
      "Considering the item belongs to '" +
      evaluationName +
      "' it has been depreciated with " +
      deprecitation +
      '% since it is at least ' +
      ageLimit +
      ' year' +
      (ageLimit > 1.0 ? 's' : '') +
      ' old.'
    )
  }

  const getCurrentChip = () => {
    if (canEvaluate && priceAndDateAvailable && marketEvaluation) {
      return <MarketValuationChip />
    }

    if (canEvaluate && priceAndDateAvailable) {
      return (
        <ExplanationPopover
          contents={<>{getExplanation(evaluation?.evaluationRule)}</>}
        >
          <ValuationChip
            valuation={valuation}
            ignored={customValuation !== ''}
          />
        </ExplanationPopover>
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
            currency={currency ?? defaultCurrency}
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
