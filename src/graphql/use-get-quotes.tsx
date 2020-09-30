import {
  GetQuotesQueryHookResult,
  Quote,
  useGetQuotesQuery,
} from 'api/generated/graphql'

type GetQuotesReturnTuple = [ReadonlyArray<Quote>, GetQuotesQueryHookResult]

export const useQuotes = (memberId): GetQuotesReturnTuple => {
  const queryResult = useGetQuotesQuery({
    variables: {
      memberId,
    },
  })
  const quotes = (queryResult.data?.member?.quotes ?? []) as ReadonlyArray<
    Quote
  >
  return [quotes, queryResult]
}
