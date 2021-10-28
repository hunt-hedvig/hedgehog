import { LoadingMessage, StandaloneMessage, Tabs } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import {
  ContractMarketTypes,
  ContractType,
  QuoteProductTypeContractMap,
} from 'features/config/constants'
import { getMarketFromPickedLocale } from 'features/member/utils'
import { useQuotes } from 'graphql/use-get-quotes'
import React from 'react'
import { Quote } from 'types/generated/graphql'
import { QuotesSubSection } from './quote-sub-section'

export const Quotes: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [activeTab, setActiveTab] = React.useState(
    ContractType.SwedishApartment,
  )
  const [{ quotes, contractMarket, pickedLocale }, { loading }] = useQuotes(
    memberId,
  )

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (!quotes?.length) {
    return <StandaloneMessage paddingTop="10vh">No quotes</StandaloneMessage>
  }

  if (!contractMarket && !pickedLocale) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Unable to get any market info, please contact Tech
      </StandaloneMessage>
    )
  }

  const memberMarket =
    contractMarket?.market ?? getMarketFromPickedLocale(pickedLocale!)

  const shouldShowInContractTypeSubSection = (quote: Quote, contractType) =>
    !!quote.productType &&
    contractType in QuoteProductTypeContractMap[quote.productType]

  const getCategorisedQuotesBasedOnContractType = (
    contractType: string,
  ): Quote[] =>
    quotes.filter((quote) =>
      shouldShowInContractTypeSubSection(quote, contractType),
    )

  return (
    <>
      <Tabs
        style={{ marginBottom: '2em' }}
        list={
          memberMarket
            ? ContractMarketTypes[memberMarket].map((type, index) => ({
                active: type.value === activeTab,
                title: convertEnumToTitle(type.value),
                action: () => setActiveTab(type.value),
                key: index,
              }))
            : []
        }
      />
      {!!quotes.length && (
        <QuotesSubSection
          memberId={memberId}
          contractType={activeTab}
          quotes={getCategorisedQuotesBasedOnContractType(activeTab)}
        />
      )}
    </>
  )
}
