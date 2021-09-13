import { MutationFunctionOptions } from '@apollo/client'
import { withDelayedRefetchContracts } from 'graphql/use-contracts'
import {
  Contract,
  RegenerateCertificateMutation,
  RegenerateCertificateMutationHookResult,
  RegenerateCertificateMutationVariables,
  useRegenerateCertificateMutation,
} from 'types/generated/graphql'

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
