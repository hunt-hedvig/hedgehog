import { UpsertClaimItemInput } from 'api/generated/graphql'
import { useCanValuateClaimItem } from 'graphql/use-can-valuate-claim-item'
import { useGetClaimItemValuation } from 'graphql/use-get-claim-item-valuation'
import React from 'react'
import { CustomValuationChip } from './chips/CustomValuationChip'
import { MessageChip } from './chips/MessageChip'

export const ValuationInfo: React.FC<{
  request: UpsertClaimItemInput
  setValuation: React.EventHandler<any>
  customValuationAmount: string
  setCustomValuationAmount: React.EventHandler<any>
  defaultCurrency: string
}> = ({
  request,
  setValuation,
  customValuationAmount,
  setCustomValuationAmount,
  defaultCurrency,
}) => {
  const TYPE_OF_CONTRACT = 'SE_APARTMENT_RENT' // To be changed

  const { itemFamilyId, itemTypeId, purchasePrice, dateOfPurchase } = request

  const [valuationStatus] = useCanValuateClaimItem(
    TYPE_OF_CONTRACT,
    itemFamilyId,
    itemTypeId,
  )

  const [claimItemValuation] = useGetClaimItemValuation({
    purchasePrice: purchasePrice ?? 0,
    itemFamilyId: itemFamilyId ?? null,
    typeOfContract: TYPE_OF_CONTRACT,
    purchaseDate: dateOfPurchase,
    itemTypeId: itemTypeId ?? null,
    baseDate: null,
  })

  React.useEffect(() => {
    setValuation(claimItemValuation?.depreciatedValue)
  }, [claimItemValuation?.depreciatedValue])

  React.useEffect(() => {
    setCustomValuationAmount('')
  }, [itemFamilyId, itemTypeId])

  return (
    <>
      <MessageChip
        valuation={claimItemValuation}
        valuationStatus={valuationStatus}
        itemFamilyId={itemFamilyId}
        price={purchasePrice?.amount}
        currency={purchasePrice?.currency ?? defaultCurrency}
        dateOfPurchase={dateOfPurchase}
        customValuation={customValuationAmount}
      />
      <CustomValuationChip
        request={request}
        customValuationAmount={customValuationAmount}
        customValuationCurrency={purchasePrice?.currency ?? defaultCurrency}
        setCustomValuationAmount={setCustomValuationAmount}
        valuation={claimItemValuation}
      />
    </>
  )
}
