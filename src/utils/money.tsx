import { MonetaryAmountV2 } from 'api/generated/graphql'

type Money =
  | MonetaryAmountV2
  | {
      amount: number
      currency: string
    }

export const formatMoney = (amount: Money): string =>
  amount.amount + ' ' + amount.currency
