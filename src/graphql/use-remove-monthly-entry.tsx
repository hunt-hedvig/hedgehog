import { MutationFunctionOptions } from '@apollo/client'
import {
  GetAccountDocument,
  RemoveMonthlyEntryMutation,
  RemoveMonthlyEntryMutationVariables,
  useRemoveMonthlyEntryMutation,
} from 'types/generated/graphql'

export const useRemoveMonthlyEntry = () => useRemoveMonthlyEntryMutation()

export const getRemoveMonthlyEntryOptions = (
  memberId: string,
  monthlyEntryId: string,
): MutationFunctionOptions<
  RemoveMonthlyEntryMutation,
  RemoveMonthlyEntryMutationVariables
> => {
  return {
    variables: {
      id: monthlyEntryId,
    },
    refetchQueries: [
      {
        query: GetAccountDocument,
        variables: { memberId },
      },
    ],
  }
}
