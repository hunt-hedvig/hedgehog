import { Trial, useGetTrialsQuery } from 'api/generated/graphql'
import { Contract } from 'components/member/tabs/contracts-tab/contract'
import { TrialComponent } from 'components/member/tabs/contracts-tab/trial'
import { RefreshButton } from 'components/member/tabs/shared/refresh-button'
import { useContracts } from 'graphql/use-contracts'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'

export const ContractTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
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
      {contracts.length > 0 ? (
        <MainHeadline>
          Contracts
          <RefreshButton onClick={() => refetch()} loading={loading}>
            <ArrowRepeat />
          </RefreshButton>
        </MainHeadline>
      ) : null}
      {contracts.map((contract) => (
        <Contract
          key={contract.id}
          contract={contract}
          refetch={refetch}
          shouldPreSelectAgreement={
            contracts.length === 1 && !contract.terminationDate
          }
        />
      ))}
      {trials.length > 0 ? <MainHeadline>Trials</MainHeadline> : null}
      {trials.map((t) => (
        <TrialComponent key={t.id} trial={t} />
      ))}
    </FadeIn>
  )
}
