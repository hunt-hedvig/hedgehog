import { MutationFunctionOptions } from '@apollo/react-common'
import {
  Contract,
  RegenerateCertificateMutation,
  RegenerateCertificateMutationHookResult,
  RegenerateCertificateMutationVariables,
  useRegenerateCertificateMutation,
} from 'api/generated/graphql'
import { withRefetchContracts } from 'graphql/use-contracts'

export const useRegenerateCertificate = (
  contract: Contract,
): RegenerateCertificateMutationHookResult => {
  return withRefetchContracts<
    RegenerateCertificateMutation,
    RegenerateCertificateMutationVariables
  >(useRegenerateCertificateMutation(), contract)
}

export const regenerateCertificateOptions = (
  agreementId: string,
): MutationFunctionOptions<
  RegenerateCertificateMutation,
  RegenerateCertificateMutationVariables
> => {
  return {
    variables: {
      agreementId,
    },
  }
}
