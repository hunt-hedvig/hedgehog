import { MonetaryAmountV2 } from 'api/generated/graphql'

type Money =
  | MonetaryAmountV2
  | {
      amount: number
      currency: string
    }

export const formatMoney = (
  amount: Money,
  options: Intl.NumberFormatOptions | null = null,
): string =>
  (options
    ? Number(amount.amount).toLocaleString(undefined, options)
    : amount.amount) +
  ' ' +
  amount.currency
