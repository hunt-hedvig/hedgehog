import {
  MutationFunction,
  MutationTuple,
  OperationVariables,
} from '@apollo/client'
import {
  Contract,
  GetContractsQueryHookResult,
  useGetContractsQuery,
} from 'api/generated/graphql'
import { useState } from 'react'
import { sleep } from 'utils/sleep'

type DelayedRefetch = () => Promise<void>
type DelayedRefetchResultTuple = [DelayedRefetch, boolean]

type ContractReturnTuple = [
  ReadonlyArray<Contract>,
  GetContractsQueryHookResult,
]

export const useContracts = (memberId: string): ContractReturnTuple => {
  const queryResult = useGetContractsQuery({
    variables: { memberId },
  })
  const contracts = (queryResult.data?.member?.contracts ?? []) as Contract[]
  return [contracts.sort(compareContracts), queryResult]
}

const compareContracts = (a: Contract, b: Contract) =>
  a.createdAt < b.createdAt ? 1 : -1

export const withDelayedRefetchContracts = <
  TData extends any,
  TVariables extends OperationVariables
>(
  mutation: MutationTuple<TData, TVariables>,
  contract: Contract,
): MutationTuple<TData, TVariables> => {
  const [delayedRefetch, delayedRefetchLoading] = delayedRefetchOfContracts(
    contract,
  )
  const mutationWithRefetch: MutationFunction<TData, TVariables> = async (
    options,
  ) => {
    const result = await mutation[0](options)
    await delayedRefetch()
    return result
  }
  return [
    mutationWithRefetch,
    { ...mutation[1], loading: mutation[1].loading || delayedRefetchLoading },
  ]
}

export const delayedRefetchOfContracts = (
  contract: Contract,
): DelayedRefetchResultTuple => {
  const [, { refetch }] = useContracts(contract.holderMemberId)

  const [loading, setLoading] = useState(false)

  const delayedRefetch = async () => {
    setLoading(true)
    await sleep(1000)
    await refetch()
    setLoading(false)
  }
  return [delayedRefetch, loading]
}
