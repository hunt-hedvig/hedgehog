export interface Money {
  amount: number | string
  currency: string | string
}

export const formatMoney = (locale: string) => (money: Money) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
  }).format(
    typeof money.amount === 'number' ? money.amount : parseFloat(money.amount),
  )

export const formatMoneySE = formatMoney('sv-SE')

export const formatMoneyNO = formatMoney('nb-NO')
