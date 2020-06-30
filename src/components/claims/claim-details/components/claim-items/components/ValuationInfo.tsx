import { UpsertClaimItemInput } from 'api/generated/graphql'
import { useCanValuateClaimItem } from 'graphql/use-can-valuate-claim-item'
import { useGetClaimItemValuation } from 'graphql/use-get-claim-item-valuation'
import React from 'react'
import { CustomValuationChip } from './chips/CustomValuationChip'
import { MessageChip } from './chips/MessageChip'

export const ValuationInfo: React.FC<{
  request: UpsertClaimItemInput
  setAutoValuation: React.EventHandler<any>
  customValuation: string
  setCustomValuation: React.EventHandler<any>
  defaultCurrency: string
}> = ({
  request,
  setAutoValuation,
  customValuation,
  setCustomValuation,
  defaultCurrency,
}) => {
  const TYPE_OF_CONTRACT = 'SE_APARTMENT_RENT' // To be changed

  const [valuationStatus] = useCanValuateClaimItem(
    TYPE_OF_CONTRACT,
    request.itemFamilyId,
    request.itemTypeId,
  )

  const [valuation] = useGetClaimItemValuation(
    request?.purchasePriceAmount ?? 0,
    request.itemFamilyId,
    TYPE_OF_CONTRACT,
    request.dateOfPurchase,
    request.itemTypeId,
    null,
  )

  React.useEffect(() => {
    setAutoValuation(valuation?.depreciatedValue)
  }, [valuation?.depreciatedValue])

  React.useEffect(() => {
    setCustomValuation('')
  }, [request.itemFamilyId, request.itemTypeId])

  return (
    <>
      <MessageChip
        valuation={valuation}
        valuationStatus={valuationStatus}
        itemFamilyId={request.itemFamilyId}
        price={request.purchasePriceAmount}
        currency={request.purchasePriceCurrency ?? defaultCurrency}
        dateOfPurchase={request.dateOfPurchase}
        customValuation={customValuation}
      />
      <CustomValuationChip
        request={request}
        customValuation={customValuation}
        customValuationCurrency={
          request.purchasePriceCurrency ?? defaultCurrency
        }
        setCustomValuation={setCustomValuation}
        valuation={valuation}
      />
    </>
  )
}
