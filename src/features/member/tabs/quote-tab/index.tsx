import { LoadingMessage, StandaloneMessage, Tabs } from '@hedvig-ui'
import { getTextFromEnumValue } from '@hedvig-ui/utils/text'
import { useQuotes } from 'graphql/use-get-quotes'
import React from 'react'
import { ContractType, Market, QuoteProductType } from 'types/enums'
import { Quote } from 'types/generated/graphql'
import { getMarketFromPickedLocale } from 'utils/member'
import { QuotesSubSection } from './quote-sub-section'

export const Quotes: React.FC<{ memberId: string }> = ({ memberId }) => {
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

  const getUniqueContractTypes = () => {
    if (memberMarket === Market.Sweden) {
      return [
        ContractType.SwedishApartment,
        ContractType.SwedishHouse,
        ContractType.SwedishAccident,
      ]
    }

    if (memberMarket === Market.Norway) {
      return [ContractType.NorwegianHomeContent, ContractType.NorwegianTravel]
    }

    if (memberMarket === Market.Denmark) {
      return [
        ContractType.DanishHomeContent,
        ContractType.DanishTravel,
        ContractType.DanishAccident,
      ]
    }

    return []
  }

  const shouldShowInContractTypeSubSection = (
    quote: Quote,
    contractType,
  ): boolean => {
    if (quote.productType === QuoteProductType.Apartment) {
      return contractType === ContractType.SwedishApartment
    }
    if (quote.productType === QuoteProductType.House) {
      return contractType === ContractType.SwedishHouse
    }
    if (quote.productType === QuoteProductType.HomeContent) {
      return (
        contractType === ContractType.NorwegianHomeContent ||
        contractType === ContractType.DanishHomeContent
      )
    }
    if (quote.productType === QuoteProductType.Travel) {
      return (
        contractType === ContractType.NorwegianTravel ||
        contractType === ContractType.DanishTravel
      )
    }
    if (quote.productType === QuoteProductType.Accident) {
      return (
        contractType === ContractType.DanishAccident ||
        contractType === ContractType.SwedishAccident
      )
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

  const [activeTab, setActiveTab] = React.useState(
    ContractType.SwedishApartment,
  )

  return (
    <>
      <Tabs
        style={{ marginBottom: '2em' }}
        list={getUniqueContractTypes().map((type, index) => ({
          active: type === activeTab,
          title: getTextFromEnumValue(type, true),
          action: () => setActiveTab(type),
          key: index,
        }))}
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
