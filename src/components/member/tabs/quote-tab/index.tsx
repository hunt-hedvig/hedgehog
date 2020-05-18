import { Quote } from 'api/generated/graphql'
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import { useQuotes } from 'graphql/use-quotes'
import * as React from 'react'
import { Tab } from 'semantic-ui-react'
import { isNorwegianMarket, isSwedishMarket } from 'utils/contract'
import { QuotesSubSection } from './quote-sub-section'

export const Quotes: React.FunctionComponent<{ memberId: string }> = ({
  memberId,
}) => {
  const [quotes, quotesLoading] = useQuotes(memberId)
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
    const contractTypes: string[] = []
    if (isSwedishMarket(contractMarket)) {
      contractTypes.push('Swedish Apartment', 'Swedish House')
    }

    if (isNorwegianMarket(contractMarket)) {
      contractTypes.push('Norwegian Home Content', 'Norwegian Travel')
    }
    return contractTypes
  }

  const getCategorisedQuotesBasedOnContractType = (
    contractType: string,
  ): Quote[] => {
    return quotes.filter((quote) => {
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
    })
  }

  const getTabs = (): any => {
    const panes = []

    getUniqueContractTypeNames().forEach((contractType) => {
      const subSection = (
        <QuotesSubSection
          memberId={memberId}
          quotes={getCategorisedQuotesBasedOnContractType(contractType)}
        />
      )
      panes.push({
        menuItem: `${contractType}`,
        render: () => <Tab.Pane>{subSection}</Tab.Pane>,
      })
    })

    return panes
  }
  console.log('Quote', quotes)

  return <Tab panes={getTabs()} />
}
