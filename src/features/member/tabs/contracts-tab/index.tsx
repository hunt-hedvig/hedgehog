import {
  FadeIn,
  LoadingMessage,
  MainHeadline,
  StandaloneMessage,
} from '@hedvig-ui'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { Contract } from 'features/member/tabs/contracts-tab/contract'
import { useContracts } from 'features/member/tabs/contracts-tab/hooks/use-contracts'
import { TrialComponent } from 'features/member/tabs/contracts-tab/trial'
import { RefreshButton } from 'features/member/tabs/shared/refresh-button'
import React, { useState } from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'
import { Trial, useGetTrialsQuery } from 'types/generated/graphql'
import {
  FocusItems,
  useFocus,
  useOldNavigation,
} from '../../../navigation/hooks/use-old-navigation'

export const ContractTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [contracts, { loading, refetch }] = useContracts(memberId)
  const trialsResult = useGetTrialsQuery({ variables: { memberId } })
  const trials = (trialsResult.data?.member?.trials ?? []) as Trial[]
  const [focusedItem, setFocusedItem] = useState<number | null>(null)

  const { focus, setFocus } = useOldNavigation()

  useFocus(FocusItems.Member.items.Contract)

  const [navigationStep] = useArrowKeyboardNavigation({
    maxStep: contracts.length - 2,
    onPerformNavigation: (index) => {
      const currentItem = index + 1
      setFocusedItem(currentItem)
      setFocus(FocusItems.Member.items.ContractTable)
    },
    direction: 'vertical',
    isActive: focus === FocusItems.Member.items.Contract,
    withNegative: true,
  })

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
      {contracts.map((contract, index) => (
        <Contract
          focused={
            navigationStep === index - 1 &&
            focus === FocusItems.Member.items.Contract
          }
          selected={focusedItem === index}
          key={contract.id}
          contract={contract}
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
