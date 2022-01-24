import { LoadingMessage, StandaloneMessage, Tabs } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import {
  ContractMarketTypes,
  InsuranceType,
  Market,
  PickedLocale,
  PickedLocaleMarket,
  QuoteProductType,
  QuoteProductTypeContractMap,
} from 'portals/hope/features/config/constants'
import { useQuotes } from 'portals/hope/features/member/tabs/quote-tab/hooks/use-get-quotes'
import React from 'react'
import { Quote } from 'types/generated/graphql'
import { QuotesSubSection } from './quote-sub-section'

export const Quotes: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [activeTab, setActiveTab] = React.useState(
    InsuranceType.SwedishApartment,
  )
  const [{ quotes, contractMarket, pickedLocale }, { loading }] =
    useQuotes(memberId)

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

  const memberMarket: string | undefined =
    contractMarket?.market ??
    (pickedLocale && PickedLocaleMarket[pickedLocale as PickedLocale])

  const getCategorisedQuotesBasedOnInsuranceType = (
    insuranceType: string,
  ): Quote[] =>
    quotes.filter(
      (quote) =>
        !!quote.productType &&
        QuoteProductTypeContractMap[
          quote.productType as QuoteProductType
        ].includes(insuranceType as InsuranceType),
    )

  return (
    <>
      <Tabs
        style={{ marginBottom: '2em' }}
        list={
          memberMarket
            ? ContractMarketTypes[memberMarket as Market].map(
                (type, index) => ({
                  active: type === activeTab,
                  title: convertEnumToTitle(type),
                  action: () => setActiveTab(type),
                  key: index,
                }),
              )
            : []
        }
      />
      {!!quotes.length && (
        <QuotesSubSection
          memberId={memberId}
          insuranceType={activeTab}
          quotes={getCategorisedQuotesBasedOnInsuranceType(activeTab)}
        />
      )}
    </>
  )
}
