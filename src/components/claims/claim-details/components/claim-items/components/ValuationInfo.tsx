import { TypeOfContract, UpsertClaimItemInput } from 'api/generated/graphql'
import { useCanValuateClaimItem } from 'graphql/use-can-valuate-claim-item'
import { useGetClaimItemValuation } from 'graphql/use-get-claim-item-valuation'
import React from 'react'
import { CustomValuationChip } from './chips/CustomValuationChip'
import { ValuationMessageChip } from './chips/ValuationMessageChip'

export const ValuationInfo: React.FC<{
  request: UpsertClaimItemInput
  setValuation: React.EventHandler<any>
  customValuationAmount: string
  setCustomValuationAmount: React.EventHandler<any>
  defaultCurrency: string
  typeOfContract: TypeOfContract
}> = ({
  request,
  setValuation,
  customValuationAmount,
  setCustomValuationAmount,
  defaultCurrency,
  typeOfContract,
}) => {
  const { itemFamilyId, itemTypeId, purchasePrice, dateOfPurchase } = request

  const [
    valuationStatus,
    { loading: loadingValuation },
  ] = useCanValuateClaimItem(itemFamilyId, itemTypeId, typeOfContract)

  const [claimItemValuation] = useGetClaimItemValuation({
    purchasePrice: purchasePrice ?? 0,
    itemFamilyId: itemFamilyId ?? null,
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
        request={request}
        customValuationAmount={customValuationAmount}
        customValuationCurrency={purchasePrice?.currency ?? defaultCurrency}
        setCustomValuationAmount={setCustomValuationAmount}
        valuation={claimItemValuation ?? null}
      />
    </>
  )
}
