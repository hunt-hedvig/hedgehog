import {
  Contract,
  ContractMarketInfo,
  GenericAgreement,
  SignSource,
} from 'api/generated/graphql'
import { Market } from 'types/enums'

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

export const isDanishMarket = (
  contractMarketInfo: ContractMarketInfo,
): boolean => {
  return contractMarketInfo.market === Market.Denmark
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

export const getFirstMasterInception = (
  contracts: ReadonlyArray<Contract>,
): string | null => {
  const masterInceptions = contracts
    .filter((contract) => !!contract.masterInception)
    .map((contract) => contract.masterInception)
  if (masterInceptions.length === 0) {
    return null
  }
  return masterInceptions.reduce((a, b) => (a < b ? a : b))
}

export const getLastTerminationDate = (
  contracts: ReadonlyArray<Contract>,
): string | null => {
  if (contracts.length === 0) {
    return null
  }
  const hasNonTerminatedContract = contracts.some(
    (contract) => !contract.isTerminated,
  )
  if (hasNonTerminatedContract) {
    return null
  }
  const terminationDates = contracts.map((contract) => contract.terminationDate)
  return terminationDates.reduce((a, b) => (a > b ? a : b))
}
