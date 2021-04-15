import { MutationFunctionOptions } from '@apollo/client'
import {
  SetCoveringEmployeeMutation,
  SetCoveringEmployeeMutationHookResult,
  SetCoveringEmployeeMutationVariables,
  useSetCoveringEmployeeMutation,
} from 'api/generated/graphql'

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
