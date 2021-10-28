// @ts-nocheck
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'

export const dateTimeFormatter = (date: string | number, format: string) => {
  try {
    return (
      date &&
      formatDate(typeof date === 'string' ? parseISO(date) : date, format)
    )
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export interface MonetaryAmount {
  amount: string
  currency: string
}
