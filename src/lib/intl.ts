export interface Money {
  amount: number
  currency: 'SEK' | string
}

export const formatMoney = (locale: 'sv-SE') => (money: Money) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
  }).format(money.amount)

export const formatMoneySE = formatMoney('sv-SE')
