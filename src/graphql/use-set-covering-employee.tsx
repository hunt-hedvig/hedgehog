import { MutationFunctionOptions } from '@apollo/client'
import {
  SetCoveringEmployeeMutation,
  SetCoveringEmployeeMutationHookResult,
  SetCoveringEmployeeMutationVariables,
  useSetCoveringEmployeeMutation,
} from 'types/generated/graphql'

export const useSetCoveringEmployee = (): SetCoveringEmployeeMutationHookResult =>
  useSetCoveringEmployeeMutation()

export const setCoveringEmployeeOptions = (
  id: string,
  coveringEmployee: boolean,
): MutationFunctionOptions<
  SetCoveringEmployeeMutation,
  SetCoveringEmployeeMutationVariables
> => {
  return {
    variables: {
      id,
      coveringEmployee,
    },
  }
}
