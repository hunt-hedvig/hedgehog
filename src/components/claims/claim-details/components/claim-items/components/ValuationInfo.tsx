import { UpsertClaimItemInput } from 'api/generated/graphql'
import { useCanValuateClaimItem } from 'graphql/use-can-valuate-claim-item'
import { useGetClaimItemValuation } from 'graphql/use-get-claim-item-valuation'
import React from 'react'
import { CustomValuationChip } from './chips/CustomValuationChip'
import { MessageChip } from './chips/MessageChip'

export const ValuationInfo: React.FC<{
  request: UpsertClaimItemInput
  setValuationAmount: React.EventHandler<any>
  customValuationAmount: string
  setCustomValuationAmount: React.EventHandler<any>
  defaultCurrency: string
}> = ({
  request,
  setValuationAmount,
  customValuationAmount,
  setCustomValuationAmount,
  defaultCurrency,
}) => {
  const TYPE_OF_CONTRACT = 'SE_APARTMENT_RENT' // To be changed

  const [valuationStatus] = useCanValuateClaimItem(
    TYPE_OF_CONTRACT,
    request.itemFamilyId,
    request.itemTypeId,
  )

  const [valuation] = useGetClaimItemValuation(
    request?.purchasePrice?.amount ?? 0,
    request.itemFamilyId,
    TYPE_OF_CONTRACT,
    request.dateOfPurchase,
    request.itemTypeId,
    null,
  )

  React.useEffect(() => {
    setValuationAmount(valuation?.depreciatedValue)
  }, [valuation?.depreciatedValue])

  React.useEffect(() => {
    setCustomValuationAmount('')
  }, [request.itemFamilyId, request.itemTypeId])

  return (
    <>
      <MessageChip
        valuation={valuation}
        valuationStatus={valuationStatus}
        itemFamilyId={request.itemFamilyId}
        price={request.purchasePrice?.amount}
        currency={request.purchasePrice?.currency ?? defaultCurrency}
        dateOfPurchase={request.dateOfPurchase}
        customValuation={customValuationAmount}
      />
      <CustomValuationChip
        request={request}
        customValuationAmount={customValuationAmount}
        customValuationCurrency={
          request.purchasePrice?.currency ?? defaultCurrency
        }
        setCustomValuationAmount={setCustomValuationAmount}
        valuation={valuation}
      />
    </>
  )
}
