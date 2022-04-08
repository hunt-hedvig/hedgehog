import { LoadingMessage, StandaloneMessage, Tabs } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import {
  ContractMarketTypes,
  InsuranceType,
  Market,
  PickedLocale,
  PickedLocaleMarket,
  QuoteProductType,
  QuoteProductTypeContractMap,
  TypeOfContract,
  TypeOfContractType,
} from 'portals/hope/features/config/constants'
import { useMemberQuotes } from 'portals/hope/features/member/tabs/quote-tab/hooks/use-member-quotes'
import React, { useEffect, useState } from 'react'
import { Quote } from 'types/generated/graphql'
import { QuotesSubSection } from './components/QuoteSubSection'
import { useContracts } from 'portals/hope/features/member/tabs/contracts-tab/hooks/use-contracts'

export const QuotesTab: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [activeTab, setActiveTab] = useState<null | InsuranceType>(null)
  const [{ quotes, contractMarket, pickedLocale }, { loading }] =
    useMemberQuotes(memberId)

  const [contracts] = useContracts(memberId)

  useEffect(() => {
    if (!activeTab && contracts && contracts.length > 0) {
      const insuranceType =
        TypeOfContractType[contracts[0].typeOfContract as TypeOfContract]

      setActiveTab(insuranceType)
    }
  }, [contracts])

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
      {!!quotes.length && activeTab && (
        <QuotesSubSection
          memberId={memberId}
          insuranceType={activeTab}
          quotes={getCategorisedQuotesBasedOnInsuranceType(activeTab)}
        />
      )}
    </>
  )
}
