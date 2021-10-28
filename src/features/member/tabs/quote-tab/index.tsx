import { LoadingMessage, StandaloneMessage, Tabs } from '@hedvig-ui'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { getTextFromEnumValue } from '@hedvig-ui/utils/text'
import {
  ContractType,
  Market,
  QuoteProductType,
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

  const getUniqueContractTypes = () => {
    if (memberMarket === Market.Sweden) {
      return [
        {
          value: ContractType.SwedishApartment,
          hotkey: {
            name: 'A',
            key: Keys.A,
          },
        },
        {
          value: ContractType.SwedishHouse,
          hotkey: {
            name: 'H',
            key: Keys.H,
          },
        },
        {
          value: ContractType.SwedishAccident,
          hotkey: {
            name: 'C',
            key: Keys.C,
          },
        },
      ]
    }

    if (memberMarket === Market.Norway) {
      return [
        {
          value: ContractType.NorwegianHomeContent,
          hotkey: {
            name: 'N',
            key: Keys.N,
          },
        },
        {
          value: ContractType.NorwegianTravel,
          hotkey: {
            name: 'T',
            key: Keys.T,
          },
        },
      ]
    }

    if (memberMarket === Market.Denmark) {
      return [
        {
          value: ContractType.DanishHomeContent,
          hotkey: {
            name: 'D',
            key: Keys.D,
          },
        },
        {
          value: ContractType.DanishTravel,
          hotkey: {
            name: 'S',
            key: Keys.S,
          },
        },
        {
          value: ContractType.DanishAccident,
          hotkey: {
            name: 'R',
            key: Keys.R,
          },
        },
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

  return (
    <>
      <Tabs
        style={{ marginBottom: '2em' }}
        list={getUniqueContractTypes().map((type, index) => ({
          active: type.value === activeTab,
          title: getTextFromEnumValue(type.value, true),
          action: () => setActiveTab(type.value),
          key: index,
          hotkey: type.hotkey,
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
