import { MonetaryAmountV2 } from 'api/generated/graphql'

type Money =
  | MonetaryAmountV2
  | {
      amount: number
      currency: string
    }

export const formatMoney = (amount: Money): string =>
  Math.round(
    typeof amount.amount === 'string'
      ? parseInt(amount.amount, 10)
      : amount.amount,
  ) +
  ' ' +
  amount.currency
