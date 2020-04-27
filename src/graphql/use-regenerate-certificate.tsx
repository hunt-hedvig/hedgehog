import { MutationFunctionOptions } from '@apollo/react-common'
import {
  Contract,
  RegenerateCertificateMutation,
  RegenerateCertificateMutationHookResult,
  RegenerateCertificateMutationVariables,
  useRegenerateCertificateMutation,
} from 'api/generated/graphql'
import { withDelayedRefetchContracts } from 'graphql/use-contracts'

export const useRegenerateCertificate = (
  contract: Contract,
): RegenerateCertificateMutationHookResult => {
  return withDelayedRefetchContracts<
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
