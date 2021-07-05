import { useCanValuateClaimItem } from 'graphql/use-can-valuate-claim-item'
import { useGetClaimItemValuation } from 'graphql/use-get-claim-item-valuation'
import React from 'react'
import { CustomValuationChip } from './chips/CustomValuationChip'
import { ValuationMessageChip } from './chips/ValuationMessageChip'

export const ValuationInfo: React.FC<{
  itemFamilyId: string
  itemTypeId: string | null
  purchasePrice: {
    amount: number
    currency: string
  }
  dateOfPurchase: string
  setValuation: React.EventHandler<any>
  customValuationAmount: string
  setCustomValuationAmount: React.EventHandler<any>
  defaultCurrency: string
  typeOfContract: string
}> = ({
  itemFamilyId,
  itemTypeId,
  purchasePrice,
  dateOfPurchase,
  setValuation,
  customValuationAmount,
  setCustomValuationAmount,
  defaultCurrency,
  typeOfContract,
}) => {
  const [
    valuationStatus,
    { loading: loadingValuation },
  ] = useCanValuateClaimItem(itemFamilyId, itemTypeId, typeOfContract)

  const [claimItemValuation] = useGetClaimItemValuation({
    purchasePrice,
    itemFamilyId,
    typeOfContract,
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
      <ValuationMessageChip
        valuation={claimItemValuation ?? null}
        valuationStatus={valuationStatus ?? null}
        loadingValuation={loadingValuation}
        itemFamilyId={itemFamilyId}
        price={purchasePrice?.amount}
        currency={purchasePrice?.currency ?? defaultCurrency}
        dateOfPurchase={dateOfPurchase}
        customValuation={customValuationAmount}
      />
      <CustomValuationChip
        itemFamilyId={itemFamilyId}
        customValuationAmount={customValuationAmount}
        customValuationCurrency={purchasePrice?.currency ?? defaultCurrency}
        setCustomValuationAmount={setCustomValuationAmount}
        valuation={claimItemValuation ?? null}
      />
    </>
  )
}
