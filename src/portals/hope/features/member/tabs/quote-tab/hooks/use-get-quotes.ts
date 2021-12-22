import { parseISO } from 'date-fns'
import {
  ContractMarketInfo,
  GetQuotesQueryHookResult,
  Quote,
  useGetQuotesQuery,
} from 'types/generated/graphql'

type GetQuotesReturnTuple = [
  {
    quotes?: ReadonlyArray<Quote>
    contractMarket?: ContractMarketInfo
    pickedLocale?: string
  },
  GetQuotesQueryHookResult,
]

const latest = (a: Quote, b: Quote) =>
  Number(parseISO(b.createdAt)) - Number(parseISO(a.createdAt))

export const useQuotes = (memberId: string): GetQuotesReturnTuple => {
  const queryResult = useGetQuotesQuery({
    variables: {
      memberId,
    },
  })
  const quotes = queryResult.data?.member?.quotes
  const contractMarket =
    queryResult.data?.member?.contractMarketInfo ?? undefined
  const pickedLocale = queryResult.data?.member?.pickedLocale ?? undefined

  return [
    {
      quotes: quotes ? [...quotes].sort(latest) : undefined,
      contractMarket,
      pickedLocale,
    },
    queryResult,
  ]
}
