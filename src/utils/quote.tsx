import {
  NorwegianHomeContent,
  NorwegianTravel,
  Quote,
  SwedishApartment,
  SwedishHouse,
} from '../api/generated/graphql'

export const isSwedishApartment = (quote: Quote): quote is SwedishApartment =>
  quote.data?.__typename === 'ApartmentQuoteData'

export const isSwedishHouse = (quote: Quote): quote is SwedishHouse =>
  quote.data?.__typename === 'HouseQuoteData'

export const isNorwegianHomeContent = (
  quote: Quote,
): quote is NorwegianHomeContent =>
  quote.data?.__typename === 'NorwegianHomeContentQuoteData'

export const isNorwegianTravel = (quote: Quote): quote is NorwegianTravel =>
  quote.data?.__typename === 'NorwegianTravelQuoteData'
