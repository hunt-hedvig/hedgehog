import {
  ContractMarketInfo,
  GetPersonQueryHookResult,
  Person,
  useGetPersonQuery,
} from 'types/generated/graphql'

type GetPersonReturnTuple = [
  {
    person?: Person
    contractMarketInfo?: ContractMarketInfo
    pickedLocale?: string
  },
  GetPersonQueryHookResult,
]

export const useGetPerson = (memberId: string): GetPersonReturnTuple => {
  const queryResult = useGetPersonQuery({
    variables: {
      memberId,
    },
  })
  const person = queryResult.data?.member?.person as Person | undefined
  const contractMarketInfo = queryResult.data?.member?.contractMarketInfo as
    | ContractMarketInfo
    | undefined
  const pickedLocale = queryResult.data?.member?.pickedLocale ?? undefined
  return [{ person, contractMarketInfo, pickedLocale }, queryResult]
}
