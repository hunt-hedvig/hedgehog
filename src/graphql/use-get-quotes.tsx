import {
  ContractMarketInfo,
  GetQuotesQueryHookResult,
  Quote,
  useGetQuotesQuery,
} from 'api/generated/graphql'
import { parseISO } from 'date-fns'

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
  const quotes = queryResult.data?.member?.quotes as Quote[] | undefined
  const contractMarket =
    queryResult.data?.member?.contractMarketInfo ?? undefined
  const pickedLocale = queryResult.data?.member?.pickedLocale

  return [
    {
      quotes: quotes ? [...quotes].sort(latest) : undefined,
      contractMarket,
      pickedLocale,
    },
    queryResult,
  ]
}
