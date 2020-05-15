import { useContracts } from 'graphql/use-contracts'
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import { signedOrExpiredPredicate, useQuotes } from 'graphql/use-quotes'
import * as React from 'react'
import styled from 'react-emotion'
import { Tab } from 'semantic-ui-react'
import { ExtraBuilding, Quote } from '../../../../api/generated/graphql'
import { Muted } from './common'
import { QuoteListItem } from './quote-list-item'

const Wrapper = styled('div')({
  padding: '1rem',
})
const Headline = styled('h1')({})

export const Quotes: React.FunctionComponent<{ memberId: string }> = ({
  memberId,
}) => {
  const [quotes, quotesLoading] = useQuotes(memberId)

  const [contracts] = useContracts(memberId)
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
    const contractTypes = contracts.map((contract) => {
      return contract.contractTypeName
    })

    return Array.from(new Set(contractTypes))
  }

  const getTabs = (): any => {
    const panes = []

    getUniqueContractTypeNames().forEach((contractType) => {
      const subSection = (
        <QuotesSubSection memberId={memberId} quotes={quotes} />
      )
      panes.push({
        menuItem: `${contractType}`,
        render: () => <Tab.Pane>{subSection}</Tab.Pane>,
      })
    })

    return panes
  }

  return <Tab panes={getTabs()} />

  // const categoriseQuotesBasedOnContractType = (
  //   contractType: String,
  // ): Quote[] => {
  //   return quotes.filter((quote) => {
  //     quote.productType === contractType
  //   })
  // }
}

export const QuotesSubSection: React.FunctionComponent<{
  memberId: string
  quotes: ReadonlyArray<Quote>
}> = ({ memberId, quotes }) => {
  return (
    <Wrapper>
      <Headline>Quotes</Headline>
      {quotes
        .filter((quote) => !signedOrExpiredPredicate(quote))
        .map((quote) => (
          <QuoteListItem key={quote.id} quote={quote} memberId={memberId} />
        ))}

      <Headline>Signed/Expired quotes</Headline>
      <Muted>
        {quotes.filter(signedOrExpiredPredicate).map((quote) => (
          <QuoteListItem
            key={quote.id}
            quote={quote}
            memberId={memberId}
            inactionable
          />
        ))}
      </Muted>
    </Wrapper>
  )
}
