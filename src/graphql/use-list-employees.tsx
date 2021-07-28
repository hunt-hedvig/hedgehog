import {
  Employee,
  ListEmployeesQueryHookResult,
  useListEmployeesQuery,
} from 'api/generated/graphql'

type ListEmployeesReturnTuple = [
  ReadonlyArray<Employee>,
  ListEmployeesQueryHookResult,
]

export const useListEmployees = (): ListEmployeesReturnTuple => {
  const queryResult = useListEmployeesQuery()

  const employees = queryResult.data?.listEmployees ?? ([] as Employee[])

  return [employees, queryResult]
}
