import {
  ApartmentQuoteData,
  ApartmentSubType,
  ContractMarketInfo,
  NorwegianHomeContentLineOfBusiness,
  NorwegianHomeContentQuoteData,
  NorwegianTravelLineOfBusiness,
  NorwegianTravelQuoteData,
  Quote,
  QuoteProductType,
  SwedishApartmentLineOfBusiness,
} from 'api/generated/graphql'
import { DropdownItemProps } from 'semantic-ui-react'
import { isNorwegianMarket, isSwedishMarket } from 'utils/contract'
import { getSubType } from 'utils/quote'

export const getProductSubTypeValue = (quote: Quote | null): string => {
  if (quote?.productType === 'APARTMENT') {
    return (quote.data as ApartmentQuoteData).subType!.toString()
  }
  if (quote?.productType === 'HOUSE') {
    return 'HOUSE'
  }
  if (quote?.productType === 'TRAVEL') {
    if (quote.data?.__typename === 'NorwegianTravelQuoteData') {
      return (quote.data as NorwegianTravelQuoteData).subType?.toString()
    }
  }
  if (quote?.productType === 'HOME_CONTENT') {
    const subType = getSubType(quote.data as NorwegianHomeContentQuoteData)
    return subType === NorwegianHomeContentLineOfBusiness.Rent
      ? 'HOME_CONTENT_RENT'
      : subType
  }
  return ''
}

export const getProductType = (
  quote: Quote,
  productType: string | null,
  contractMarket: ContractMarketInfo,
): QuoteProductType => {
  if (productType === null) {
    return quote.productType!!
  }
  if (isSwedishMarket(contractMarket)) {
    return isSwedishHouseProductType(productType)
      ? QuoteProductType.House
      : QuoteProductType.Apartment
  }
  if (isNorwegianMarket(contractMarket)) {
    return isNorwegianTravelFormStateProductSubType(productType)
      ? QuoteProductType.Travel
      : QuoteProductType.HomeContent
  }
  throw Error(`Expected ${contractMarket.market} to be either Sweden or Norway`)
}

export const isNorwegianTravelFormStateProductSubType = (
  productType: string | null,
): boolean => {
  return (
    productType === NorwegianTravelLineOfBusiness.Youth ||
    productType === NorwegianTravelLineOfBusiness.Regular
  )
}

export const isSwedishHouseProductType = (
  productType: string | null,
): boolean => {
  return productType === 'HOUSE'
}

export const isNorwegianHomeContentFormStateProductSubType = (
  productType: string | null,
): boolean => {
  if (productType === null) {
    return false
  }
  const subTypes: string[] = [
    NorwegianHomeContentLineOfBusiness.Own,
    'HOME_CONTENT_RENT',
    NorwegianHomeContentLineOfBusiness.YouthOwn,
    NorwegianHomeContentLineOfBusiness.YouthRent,
  ]
  return subTypes.includes(productType)
}

export const isSwedishApartmentContentFormStateProductSubType = (
  productType: string | null,
): boolean => {
  if (productType === null) {
    return false
  }
  const subTypes: string[] = [
    ApartmentSubType.Brf,
    ApartmentSubType.Rent,
    ApartmentSubType.StudentBrf,
    ApartmentSubType.StudentRent,
  ]
  return subTypes.includes(productType)
}

export const swedishHouseDropdownItemProps = (): DropdownItemProps[] => [
  { text: 'House', value: 'HOUSE' },
]

export const swedishApartmentDropdownItemProps = (): DropdownItemProps[] => [
  {
    text: 'Apartment (rent)',
    value: SwedishApartmentLineOfBusiness.Rent,
  },
  {
    text: 'Apartment (brf)',
    value: SwedishApartmentLineOfBusiness.Brf,
  },
  {
    text: 'Apartment (student rent)',
    value: SwedishApartmentLineOfBusiness.StudentRent,
  },
  {
    text: 'Apartment (student brf)',
    value: SwedishApartmentLineOfBusiness.StudentBrf,
  },
]

export const norwegianTravelDropdownItemProps = (): DropdownItemProps[] => [
  {
    text: 'Norwegian Travel',
    value: NorwegianTravelLineOfBusiness.Regular,
  },
  {
    text: 'Norwegian Travel (youth)',
    value: NorwegianTravelLineOfBusiness.Youth,
  },
]

export const norwegianHomeContentDropdownItemProps = (): DropdownItemProps[] => [
  {
    text: 'Norwegian Home Content (own)',
    value: NorwegianHomeContentLineOfBusiness.Own,
  },
  {
    text: 'Norwegian Home Content (rent)',
    value: 'HOME_CONTENT_RENT',
  },
  {
    text: 'Norwegian Home Content (youth own)',
    value: NorwegianHomeContentLineOfBusiness.YouthOwn,
  },
  {
    text: 'Norwegian Home Content (youth rent)',
    value: NorwegianHomeContentLineOfBusiness.YouthRent,
  },
]
