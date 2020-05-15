import { useContracts } from 'graphql/use-contracts'
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import { signedOrExpiredPredicate, useQuotes } from 'graphql/use-quotes'
import * as React from 'react'
import styled from 'react-emotion'
import { Action } from 'redux'
import { Button, Tab } from 'semantic-ui-react'
import { ExtraBuilding, Quote } from '../../../../api/generated/graphql'
import { showNotification } from '../../../../store/actions/notificationsActions'
import { isNorwegianMarket, isSwedishMarket } from '../../../../utils/contract'
import { Muted } from './common'
import { QuoteListItem } from './quote-list-item'
import { QuoteModification } from './quote-modification'

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

export const QuotesSubSection: React.FunctionComponent<{
  memberId: string
  quotes: ReadonlyArray<Quote>
}> = ({ memberId, quotes }) => {
  const [action, setAction] = React.useState<Action | null>(null)
  const [isWip, setIsWip] = React.useState(false)

  const handleClick = (): any => {
    return (
      <>
        {console.log('here')}
        <QuoteModification
          quote={null}
          memberId={memberId}
          onWipChange={setIsWip}
          onSubmitted={() => {
            if (showNotification) {
              showNotification({
                header: 'Saved',
                message: <>Quote saved</>,
                type: 'olive',
              })
            }
            setIsWip(false)
            setAction(null)
          }}
        />
      </>
    )
  }

  return (
    <Wrapper>
      <QuoteModification
        quote={null}
        memberId={memberId}
        onWipChange={setIsWip}
        onSubmitted={() => {
          if (showNotification) {
            showNotification({
              header: 'Saved',
              message: <>Quote saved</>,
              type: 'olive',
            })
          }
          setIsWip(false)
          setAction(null)
        }}
      />
      {quotes.length === 0 && <Button onClick={handleClick()}>Create</Button>}
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
