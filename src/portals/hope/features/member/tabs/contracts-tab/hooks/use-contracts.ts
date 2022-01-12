import {
  Contract,
  GetContractsQueryHookResult,
  useGetContractsQuery,
} from 'types/generated/graphql'

type ContractReturnTuple = [
  ReadonlyArray<Contract>,
  GetContractsQueryHookResult,
]

export const useContracts = (memberId: string): ContractReturnTuple => {
  const queryResult = useGetContractsQuery({
    variables: { memberId },
  })
  const contracts = (queryResult.data?.member?.contracts ?? []) as Contract[]
  return [[...contracts].sort(compareContracts), queryResult]
}

const compareContracts = (a: Contract, b: Contract) =>
  a.createdAt < b.createdAt ? 1 : -1
