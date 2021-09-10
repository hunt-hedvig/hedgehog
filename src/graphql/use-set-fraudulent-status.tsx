import { MutationFunctionOptions } from '@apollo/client'
import {
  GetMemberInfoDocument,
  MemberFraudulentStatusInput,
  SetFraudulentStatusMutation,
  SetFraudulentStatusMutationHookResult,
  SetFraudulentStatusMutationVariables,
  useSetFraudulentStatusMutation,
} from 'types/generated/graphql'

export const useSetFraudulentStatus = (): SetFraudulentStatusMutationHookResult => {
  return useSetFraudulentStatusMutation()
}

export const getSetFraudulentStatusOptions = (
  memberId: string,
  request: MemberFraudulentStatusInput,
): MutationFunctionOptions<
  SetFraudulentStatusMutation,
  SetFraudulentStatusMutationVariables
> => {
  return {
    variables: {
      memberId,
      request,
    },
    refetchQueries: [
      {
        query: GetMemberInfoDocument,
        variables: {
          memberId,
        },
      },
    ],
  }
}
