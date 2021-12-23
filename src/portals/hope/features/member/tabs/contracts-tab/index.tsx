import {
  FadeIn,
  LoadingMessage,
  MainHeadline,
  StandaloneMessage,
} from '@hedvig-ui'
import { Contract } from 'portals/hope/features/member/tabs/contracts-tab/contract'
import { useContracts } from 'portals/hope/features/member/tabs/contracts-tab/hooks/use-contracts'
import { TrialComponent } from 'portals/hope/features/member/tabs/contracts-tab/trial'
import { RefreshButton } from 'portals/hope/features/member/tabs/shared/refresh-button'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'
import { Trial, useGetTrialsQuery } from 'types/generated/graphql'

export const ContractTab: React.FC<{
  memberId: string
  locale: string
}> = ({ memberId, locale }) => {
  const [contracts, { loading, refetch }] = useContracts(memberId)
  const trialsResult = useGetTrialsQuery({ variables: { memberId } })
  const trials = (trialsResult.data?.member?.trials ?? []) as Trial[]

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (contracts.length === 0 && trials.length === 0) {
    return (
      <StandaloneMessage paddingTop="10vh">
        No contract for member
      </StandaloneMessage>
    )
  }

  return (
    <FadeIn>
      {contracts.length > 0 && (
        <MainHeadline>
          Contracts
          <RefreshButton
            onClick={() => refetch()}
            isloading={loading || undefined}
          >
            <ArrowRepeat />
          </RefreshButton>
        </MainHeadline>
      )}
      {contracts.map((contract) => (
        <Contract
          key={contract.id}
          contract={contract}
          locale={locale}
          refetch={refetch}
          shouldPreSelectAgreement={
            contracts.length === 1 && !contract.terminationDate
          }
        />
      ))}
      {trials.length > 0 && <MainHeadline>Trials</MainHeadline>}
      {trials.map((trial) => (
        <TrialComponent key={trial.id} trial={trial} />
      ))}
    </FadeIn>
  )
}
