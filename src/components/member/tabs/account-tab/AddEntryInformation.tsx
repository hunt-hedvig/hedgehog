import { MonetaryAmountV2 } from 'api/generated/graphql'
import React from 'react'
import { formatMoney } from 'utils/money'

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
      If we add this entry, we will charge this member{' '}
      {formatMoney(absoluteAmount)}{' '}
      <strong>{+amount.amount < 0 ? 'less' : 'more'}</strong>
    </div>
  )
}
