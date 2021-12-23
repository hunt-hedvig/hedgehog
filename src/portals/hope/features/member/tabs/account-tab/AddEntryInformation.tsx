import { formatMoney } from '@hedvig-ui/utils/money'
import React from 'react'
import { MonetaryAmountV2 } from 'types/generated/graphql'

export const AddEntryInformation: React.FC<{
  amount: MonetaryAmountV2
}> = ({ amount }) => {
  if (!amount.amount || +amount.amount === 0) {
    return null
  }

  const absoluteAmount = {
    amount: Math.abs(+amount.amount),
    currency: amount.currency,
  }

  return (
    <div>
      If this entry is added, the member will be charged{' '}
      {formatMoney(absoluteAmount)}{' '}
      <strong>{+amount.amount < 0 ? 'less' : 'more'}</strong>
    </div>
  )
}
