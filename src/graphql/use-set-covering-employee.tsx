import { MutationFunctionOptions } from '@apollo/react-common'
import {
  Scalars,
  SetCoveringEmployeeMutation,
  SetCoveringEmployeeMutationHookResult,
  SetCoveringEmployeeMutationVariables,
  useSetCoveringEmployeeMutation,
} from '../api/generated/graphql'

export const useSetCoveringEmployee = (): SetCoveringEmployeeMutationHookResult =>
  useSetCoveringEmployeeMutation()

export const setCoveringEmployeeOptions = (
  id: Scalars['ID'],
  coveringEmployee: Scalars['Boolean'],
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
