import {
  DashboardNumbers,
  GetDashboardNumbersQueryHookResult,
  useGetDashboardNumbersQuery,
} from 'api/generated/graphql'

type DashboardNumbersReturnTuple = [
  DashboardNumbers | undefined,
  GetDashboardNumbersQueryHookResult,
]

export const useDashboardNumbers = (): DashboardNumbersReturnTuple => {
  const queryResult = useGetDashboardNumbersQuery()
  const dashboardNumbers = queryResult.data?.dashboardNumbers as
    | DashboardNumbers
    | undefined
  return [dashboardNumbers, queryResult]
}
