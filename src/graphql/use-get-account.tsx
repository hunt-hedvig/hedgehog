import {
  Account,
  GetAccountQueryHookResult,
  useGetAccountQuery,
} from 'api/generated/graphql'

type AccountReturnTuple = [Account | undefined, GetAccountQueryHookResult]

export const useGetAccount = (memberId: string): AccountReturnTuple => {
  const queryResult = useGetAccountQuery({
    variables: { memberId },
    pollInterval: 2000,
  })
  const account = queryResult.data?.member?.account as Account | undefined
  return [account, queryResult]
}
