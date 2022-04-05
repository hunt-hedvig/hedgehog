import { JSONSchema7 } from 'json-schema'
import { useMemberQuotesQuery } from 'types/generated/graphql'

interface UseQuoteFieldSuggestionsResult {
  suggestions: Record<string, JSONSchema7 | boolean>
}

export const useQuoteFieldSuggestions = (
  memberId: string,
): UseQuoteFieldSuggestionsResult => {
  const { data } = useMemberQuotesQuery({
    variables: {
      memberId,
    },
    fetchPolicy: 'cache-first',
  })

  const quotes = data?.member?.quotes ?? []

  const suggestions = quotes
    .filter((quote) => quote.state === 'SIGNED')
    .slice()
    .sort((q1, q2) => (q1.createdAt < q2.createdAt ? 1 : -1))
    .reduce<Record<string, JSONSchema7 | boolean>>(
      (acc, quote) => ({ ...acc, ...quote.schemaData }),
      {},
    )

  return { suggestions }
}
