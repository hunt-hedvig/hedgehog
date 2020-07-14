import {
  Address,
  Agreement,
  Contract,
  ContractMarketInfo,
  SignSource,
} from 'api/generated/graphql'
import {
  isNorwegianHomeContent,
  isSwedishApartment,
  isSwedishHouse,
} from 'utils/agreement'

export const getSignSource = (signSource: SignSource): string => {
  if (signSource === SignSource.App) {
    return 'App'
  }
  if (signSource === SignSource.Android) {
    return 'Android'
  }
  if (signSource === SignSource.Ios) {
    return 'iOS'
  }
  if (signSource === SignSource.Hope) {
    return 'H.OPE.'
  }
  if (signSource === SignSource.Rapio) {
    return 'Partner'
  }
  if (signSource === SignSource.Web) {
    return 'Web'
  }
  if (signSource === SignSource.Webonboarding) {
    return 'Web On-boarding'
  }
  return signSource
}

export const isSwedishMarket = (market: ContractMarketInfo): boolean => {
  return market.market === 'SWEDEN'
}

export const isNorwegianMarket = (market: ContractMarketInfo): boolean => {
  return market.market === 'NORWAY'
}

export const currentAgreementForContract = (
  contract: Contract,
): Agreement | undefined | null => {
  return contract.agreements.find(
    (agreement) => agreement.id === contract.currentAgreementId,
  )
}

export const getAddressFromContract = (contract: Contract): Address | null => {
  const currentAgreement = currentAgreementForContract(contract)
  if (
    currentAgreement != null &&
    (isSwedishApartment(currentAgreement) ||
      isSwedishHouse(currentAgreement) ||
      isNorwegianHomeContent(currentAgreement))
  ) {
    return currentAgreement.address
  } else {
    return null
  }
}
