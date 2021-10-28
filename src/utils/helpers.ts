// @ts-nocheck
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Returns string splitted by words
 * @param {string} field
 * @example 'memberFirstName' -> 'Member first name'
 */
export const getFieldName = (field) =>
  capitalize(
    field
      .match(/([A-Z]?[^A-Z]*)/g)
      .slice(0, -1)
      .join(' '),
  )

export const getFieldValue = (value) => {
  if (!value) {
    return ''
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.keys(value).map((key) => `${key}: ${value[key]}, `)
  }
  return value.toString()
}

export const range = (start, end) =>
  start >= 0 && end >= start
    ? Array.from({ length: end - start }, (v, k) => k + start)
    : []

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
