import { Contract, GenericAgreement, SignSource } from 'api/generated/graphql'

export const getSignSource = (signSource: SignSource): string => {
  switch (signSource) {
    case SignSource.App:
      return 'App'
    case SignSource.Android:
      return 'Android'
    case SignSource.Ios:
      return 'iOS'
    case SignSource.Hope:
      return 'Hope'
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

export const currentAgreementForContract = (
  contract: Pick<Contract, 'genericAgreements' | 'currentAgreementId'>,
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
  contracts: ReadonlyArray<Pick<Contract, 'masterInception'>>,
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
  contracts: ReadonlyArray<Pick<Contract, 'isTerminated' | 'terminationDate'>>,
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
