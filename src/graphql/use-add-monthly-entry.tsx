import { MutationFunctionOptions } from '@apollo/client'
import {
  AddMonthlyEntryMutation,
  AddMonthlyEntryMutationVariables,
  GetAccountDocument,
  MonthlyEntryInput,
  useAddMonthlyEntryMutation,
} from 'types/generated/graphql'

export const useAddMonthlyEntry = () => useAddMonthlyEntryMutation()

export const getAddMonthlyEntryOptions = (
  memberId: string,
  monthlyEntryInput: MonthlyEntryInput,
): MutationFunctionOptions<
  AddMonthlyEntryMutation,
  AddMonthlyEntryMutationVariables
> => {
  return {
    variables: {
      memberId,
      input: monthlyEntryInput,
    },
    refetchQueries: [
      {
        query: GetAccountDocument,
        variables: { memberId },
      },
    ],
  }
}
