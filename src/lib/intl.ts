export interface Money {
  amount: number | string
  currency: 'SEK' | string
}

export const formatMoney = (locale: 'sv-SE') => (money: Money) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
  }).format(
    typeof money.amount === 'number' ? money.amount : parseFloat(money.amount),
  )

export const formatMoneySE = formatMoney('sv-SE')
