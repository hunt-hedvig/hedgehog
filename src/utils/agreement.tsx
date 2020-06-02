import {
  Agreement,
  NorwegianHomeContent,
  NorwegianTravel,
  SwedishApartment,
  SwedishHouse,
} from 'api/generated/graphql'
import { match } from 'matchly'
import styled from 'react-emotion'

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

export const InsuranceStatusBadge = styled('div')<{ status: string }>(
  ({ theme, status }) => ({
    display: 'inline-block',
    fontSize: '0.8rem',
    padding: '0.25rem 0.8rem',
    backgroundColor: match([
      ['ACTIVE', theme.activeInsuranceBackground],
      ['PENDING', theme.pendingInsuranceBackground],
      ['TERMINATED', theme.terminatedInsuranceBackground],
      [match.any(), theme.mutedBackground],
    ])(status),
    color: match([
      ['ACTIVE', theme.activeInsuranceForeground],
      ['PENDING', theme.pendingInsuranceForeground],
      ['TERMINATED', theme.terminatedInsuranceForeground],
      [match.any(), theme.mutedText],
    ])(status),
    textTransform: 'capitalize',
    borderRadius: '1000px',
  }),
)
