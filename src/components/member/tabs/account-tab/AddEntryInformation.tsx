import { MonetaryAmountV2 } from 'api/generated/graphql'
import { parseAmount } from 'components/member/tabs/account-tab/AddEntryForm'
import React from 'react'
import { formatMoney } from 'utils/money'

export const AddEntryInformation: React.FC<{
  amount: MonetaryAmountV2
  memberId: string
}> = ({ amount, memberId }) => {
  const parsedAmount = parseAmount(amount.amount)
  const validAmount = !isNaN(parsedAmount) && parsedAmount !== 0

  if (!validAmount) {
    return <></>
  }

  return (
    <div>
      {memberId} will owe us {formatMoney(amount)}{' '}
      <strong>{parsedAmount < 0 ? 'less' : 'more'}</strong>
    </div>
  )
}
