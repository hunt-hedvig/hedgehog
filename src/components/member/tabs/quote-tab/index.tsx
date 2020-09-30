import { Quote } from 'api/generated/graphql'
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import { useQuotes } from 'graphql/use-get-quotes'
import * as React from 'react'
import { Tab } from 'semantic-ui-react'
import { isNorwegianMarket, isSwedishMarket } from 'utils/contract'
import { QuotesSubSection } from './quote-sub-section'

export const Quotes: React.FunctionComponent<{ memberId: string }> = ({
  memberId,
}) => {
  const [quotes, { loading: quotesLoading }] = useQuotes(memberId)
  const [contractMarket, { loading }] = useContractMarketInfo(memberId)

  if (loading) {
    return null
  }

  if (quotesLoading) {
    return <>Loading...</>
  }

  if (!quotesLoading && quotes.length === 0) {
    return <em>No quotes :(</em>
  }

  if (!contractMarket) {
    return <>Unable to get Market, please contact Tech</>
  }

  const getUniqueContractTypeNames = () => {
    if (isSwedishMarket(contractMarket)) {
      return ['Swedish Apartment', 'Swedish House']
    }

    if (isNorwegianMarket(contractMarket)) {
      return ['Norwegian Home Content', 'Norwegian Travel']
    }

    return []
  }

  const shouldShowInContractTypeSubSection = (
    quote: Quote,
    contractType,
  ): boolean => {
    if (quote.productType === 'HOME_CONTENT') {
      return contractType === 'Norwegian Home Content'
    }
    if (quote.productType === 'TRAVEL') {
      return contractType === 'Norwegian Travel'
    }
    if (quote.productType === 'APARTMENT') {
      return contractType === 'Swedish Apartment'
    }
    if (quote.productType === 'HOUSE') {
      return contractType === 'Swedish House'
    }
    return false
  }

  const getCategorisedQuotesBasedOnContractType = (
    contractType: string,
  ): Quote[] => {
    return quotes.filter((quote) =>
      shouldShowInContractTypeSubSection(quote, contractType),
    )
  }

  const getTabs = () =>
    getUniqueContractTypeNames().map((contractType) => ({
      menuItem: contractType,
      render: () => (
        <Tab.Pane>
          <QuotesSubSection
            memberId={memberId}
            contractType={contractType}
            quotes={getCategorisedQuotesBasedOnContractType(contractType)}
          />
        </Tab.Pane>
      ),
    }))
  return <Tab panes={getTabs()} />
}
