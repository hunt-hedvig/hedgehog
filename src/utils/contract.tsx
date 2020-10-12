import {
  Contract,
  ContractMarketInfo,
  GenericAgreement,
  Market,
  SignSource,
} from 'api/generated/graphql'

export enum ContractType {
  SwedishApartment = 'SWEDISH_APARTMENT',
  SwedishHouse = 'SWEDISH_HOUSE',
  NorwegianHomeContent = 'NORWEGIAN_HOME_CONTENT',
  NorwegianTravel = 'NORWEGIAN_TRAVEL',
}

export const getSignSource = (signSource: SignSource): string => {
  switch (signSource) {
    case SignSource.App:
      return 'App'
    case SignSource.Android:
      return 'Android'
    case SignSource.Ios:
      return 'iOS'
    case SignSource.Hope:
      return 'H.OPE.'
    case SignSource.Rapio:
      return 'Partner'
    case SignSource.Web:
      return 'Web'
    case SignSource.Webonboarding:
      return 'Web On-boarding'
    default:
      return signSource
  }
}

export const isSwedishMarket = (
  contractMarketInfo: ContractMarketInfo,
): boolean => {
  return contractMarketInfo.market === Market.Sweden
}

export const isNorwegianMarket = (
  contractMarketInfo: ContractMarketInfo,
): boolean => {
  return contractMarketInfo.market === Market.Norway
}

export const currentAgreementForContract = (
  contract: Contract,
): GenericAgreement | undefined => {
  return contract.genericAgreements.find(
    (agreement) => agreement.id === contract.currentAgreementId,
  )
}

export const getContractByAgreementId = (
  contracts: ReadonlyArray<Contract>,
  agreementId: string,
): Contract | undefined => {
  return contracts.find((contract) =>
    contract.genericAgreements.some(
      (agreement) => agreement.id === agreementId,
    ),
  )
}
