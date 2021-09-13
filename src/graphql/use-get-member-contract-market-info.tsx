import {
  ContractMarketInfo,
  GetContractMarketInfoQueryHookResult,
  useGetContractMarketInfoQuery,
} from 'types/generated/graphql'

type ContractMarketInfoReturnTuple = [
  ContractMarketInfo | undefined,
  GetContractMarketInfoQueryHookResult,
]

export const useContractMarketInfo = (
  memberId: string,
): ContractMarketInfoReturnTuple => {
  const queryResult = useGetContractMarketInfoQuery({
    variables: { memberId },
  })
  const contractMarketInfo = queryResult.data?.member?.contractMarketInfo as
    | ContractMarketInfo
    | undefined
  return [contractMarketInfo, queryResult]
}
