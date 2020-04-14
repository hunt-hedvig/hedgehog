import {
  Agreement,
  NorwegianHomeContent,
  NorwegianTravel,
  SwedishApartment,
  SwedishHouse,
} from 'api/generated/graphql'

export const getLineOfBusiness = (agreement: Agreement): string => {
  if (isSwedishApartment(agreement)) {
    // @ts-ignore
    return agreement.swedishApartmentLineOfBusiness
  }
  if (isSwedishHouse(agreement)) {
    // @ts-ignore
    return 'HOUSE'
  }
  if (isNorwegianHomeContent(agreement)) {
    // @ts-ignore
    return agreement.norwegianHomeContentLineOfBusiness
  }
  if (isNorwegianTravel(agreement)) {
    // @ts-ignore
    return agreement.norwegianTravelLineOfBusiness
  }
  throw new Error(`Unsupported agreement type ${agreement}`)
}

export const isSwedishApartment = (
  agreement: Agreement,
): agreement is SwedishApartment => agreement.__typename === 'SwedishApartment'

export const isSwedishHouse = (
  agreement: Agreement,
): agreement is SwedishHouse => agreement.__typename === 'SwedishHouse'

export const isNorwegianHomeContent = (
  agreement: Agreement,
): agreement is NorwegianHomeContent =>
  agreement.__typename === 'NorwegianHomeContent'

export const isNorwegianTravel = (
  agreement: Agreement,
): agreement is NorwegianTravel => agreement.__typename === 'NorwegianTravel'
