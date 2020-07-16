import {
  GetPersonQueryHookResult,
  Person,
  useGetPersonQuery,
} from 'api/generated/graphql'

type GetPersonReturnTuple = [Person, GetPersonQueryHookResult]

export const useGetPerson = (memberId: string): GetPersonReturnTuple => {
  const queryResult = useGetPersonQuery({
    variables: {
      memberId,
    },
  })
  const person = queryResult.data?.member?.person as Person | undefined
  return [person, queryResult]
}
