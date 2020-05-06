import {
  NorwegianHomeContent,
  NorwegianTravel,
  Quote,
  QuoteProductType,
  SwedishApartment,
  SwedishHouse,
} from '../api/generated/graphql'

export const isSwedishApartment = (quote: Quote): quote is SwedishApartment =>
  quote.productType === QuoteProductType.Apartment

export const isSwedishHouse = (quote: Quote): quote is SwedishHouse =>
  quote.productType === QuoteProductType.House

export const isNorwegianHomeContent = (
  quote: Quote,
): quote is NorwegianHomeContent =>
  quote.productType === QuoteProductType.HomeContent

export const isNorwegianTravel = (quote: Quote): quote is NorwegianTravel =>
  quote.productType === QuoteProductType.Travel
