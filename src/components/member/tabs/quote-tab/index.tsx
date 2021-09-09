import {
  getTextFromEnumValue,
  LoadingMessage,
  StandaloneMessage,
} from '@hedvig-ui'
import { Quote } from 'api/generated/graphql'
import { useQuotes } from 'graphql/use-get-quotes'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import React from 'react'
import { Tab } from 'semantic-ui-react'
import { ContractType, Market, QuoteProductType } from 'types/enums'
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

  const getTabs = () =>
    getUniqueContractTypes().map((contractType) => ({
      menuItem: getTextFromEnumValue(contractType, true),
      render: () => (
        <Tab.Pane>
          <FadeIn>
            <QuotesSubSection
              memberId={memberId}
              contractType={contractType}
              quotes={getCategorisedQuotesBasedOnContractType(contractType)}
            />
          </FadeIn>
        </Tab.Pane>
      ),
    }))
  return <Tab panes={getTabs()} />
}
