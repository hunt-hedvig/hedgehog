import { Market } from '../types/enums'

export const convertEnumToTitle = (enumText: string) => {
  return enumText
    .toLowerCase()
    .split('_')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
export const convertEnumOrSentenceToTitle = (enumText: string) => {
  return enumText
    .toLowerCase()
    .split(/_|\s/)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export const formatPostalCode = (postalCode: string): string => {
  if (postalCode.length === 5) {
    return postalCode.slice(0, 3) + ' ' + postalCode.slice(3)
  }
  return postalCode
}

export const convertCamelcaseToTitle = (text) =>
  text.charAt(0).toUpperCase() + text.substring(1).replace(/(\B[A-Z])/g, ' $1')

export const getCarrierText = (carrier: string) => {
  switch (carrier) {
    case 'EIR':
      return '⚠️ EIR'
    case 'HEDVIG':
      return 'Ⓗ Hedvig'
    case 'HDI':
      return '🗄 HDI'
  }
  return carrier
}

export const getFlagFromMarket = (market: Market): string => {
  switch (market) {
    case Market.Norway:
      return '🇳🇴'
    case Market.Sweden:
      return '🇸🇪'
    case Market.Denmark:
      return '🇩🇰'
    default:
      return '🏳'
  }
}

export const splitOnUpperCase = (s: string) => {
  const splitResult = s.match(/[A-Z][a-z]+|[0-9]+/g)
  return splitResult?.join(' ') ?? null
}
