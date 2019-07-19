export interface Money {
  amount: number | string
  currency: 'SEK' | string
}

export const formatMoney = (locale: 'sv-SE', digits?: number) => (
  money: Money,
) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
    maximumFractionDigits: digits ? digits : 2,
    minimumFractionDigits: digits ? digits : 2,
  }).format(
    typeof money.amount === 'number' ? money.amount : parseFloat(money.amount),
  )

export const formatMoneySE = formatMoney('sv-SE')
