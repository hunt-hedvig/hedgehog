import {
  ApartmentQuoteData,
  HouseQuoteData,
  NorwegianHomeContentQuoteData,
  NorwegianTravelQuoteData,
  Quote,
  QuoteData,
} from 'api/generated/graphql'

type QuoteDataMaybe = QuoteData | null | undefined

export const isSwedishApartment = (
  quoteData: QuoteDataMaybe,
): quoteData is ApartmentQuoteData =>
  quoteData?.__typename === 'ApartmentQuoteData'

export const isSwedishHouse = (
  quoteData: QuoteDataMaybe,
): quoteData is HouseQuoteData => quoteData?.__typename === 'HouseQuoteData'

export const isNorwegianHomeContent = (
  quoteData: QuoteDataMaybe,
): quoteData is NorwegianHomeContentQuoteData =>
  quoteData?.__typename === 'NorwegianHomeContentQuoteData'

export const isNorwegianTravel = (
  quoteData: QuoteDataMaybe,
): quoteData is NorwegianTravelQuoteData =>
  quoteData?.__typename === 'NorwegianTravelQuoteData'

export const getSubType = (quoteData: QuoteData): string => {
  if (isSwedishApartment(quoteData)) {
    return quoteData?.subType!
  }
  if (isNorwegianHomeContent(quoteData)) {
    // @ts-ignore
    return quoteData?.norwegianHomeContentSubType!
  }
  if (isNorwegianTravel(quoteData)) {
    // @ts-ignore
    return quoteData?.norwegianTravelSubType!
  }
  throw Error(`Unable to return subType of quoteData=${quoteData}`)
}

export const isSignedOrExpired = (quote: Quote) =>
  isExpired(quote) || isSigned(quote)

export const isExpired = (quote: Quote) => {
  const createdAt = new Date(quote.createdAt)
  const now = new Date()

  return now > createdAt
}

export const isSigned = (quote: Quote) => quote.state === 'SIGNED'
