import { Contract, GenericAgreement } from 'types/generated/graphql'

export const getSignSource = (signSource: string): string => {
  switch (signSource) {
    case 'APP':
      return 'App'
    case 'ANDROID':
      return 'Android'
    case 'IOS':
      return 'iOS'
    case 'HOPE':
      return 'Hope'
    case 'RAPIO':
      return 'Partner'
    case 'WEB':
      return 'Web'
    case 'WEBONBOARDING':
      return 'Web On-boarding'
    case 'SELF_CHANGE':
      return 'Self-service'
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
  contracts: ReadonlyArray<Pick<Contract, 'terminationDate'>>,
): string | null => {
  if (contracts.length === 0) {
    return null
  }
  const hasNonTerminatedContract = contracts.some(
    (contract) => !contract.terminationDate,
  )
  if (hasNonTerminatedContract) {
    return null
  }
  const terminationDates = contracts.map((contract) => contract.terminationDate)
  return terminationDates.reduce((a, b) => (a > b ? a : b))
}
