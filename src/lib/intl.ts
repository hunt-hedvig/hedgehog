export interface Money {
  amount: number | string
  currency: 'SEK' | string
}

export const formatMoney = (locale: 'sv-SE', digits: number = 2) => ( money : Money) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(
    typeof money.amount === 'number' ? money.amount : parseFloat(money.amount),
  )

export const formatMoneySE = formatMoney('sv-SE')
