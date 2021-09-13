import {
  DashboardNumbers,
  GetDashboardNumbersQueryHookResult,
  useGetDashboardNumbersQuery,
} from 'types/generated/graphql'

type DashboardNumbersReturnTuple = [
  DashboardNumbers | undefined,
  GetDashboardNumbersQueryHookResult,
]

export const useDashboardNumbers = (): DashboardNumbersReturnTuple => {
  const queryResult = useGetDashboardNumbersQuery({
    pollInterval: 1000 * 5,
  })
  const dashboardNumbers = queryResult.data?.dashboardNumbers as
    | DashboardNumbers
    | undefined
  return [dashboardNumbers, queryResult]
}
