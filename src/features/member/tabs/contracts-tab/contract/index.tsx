import styled from '@emotion/styled'
import {
  Card,
  CardsWrapper,
  InfoContainer,
  InfoRow,
  InfoText,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { Agreement } from 'features/member/tabs/contracts-tab/agreement'
import { AgreementsTable } from 'features/member/tabs/contracts-tab/agreement/AgreementsTable'
import { MasterInception } from 'features/member/tabs/contracts-tab/contract/master-inception'
import { TerminationDate } from 'features/member/tabs/contracts-tab/contract/termination-date'
import { getSignSource } from 'features/member/tabs/contracts-tab/utils'
import {
  FocusItems,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import React, { useEffect, useRef } from 'react'
import { Contract as ContractType } from 'types/generated/graphql'
import { useElementFocus } from '@hedvig-ui/hooks/use-element-focus'

const ContractsCardsWrapper = styled(CardsWrapper)<{ focused: boolean }>`
  border-radius: 0.5rem;
  box-shadow: ${({ focused }) =>
    focused ? '0px 0px 10px 6px rgba(34, 60, 80, 0.2)' : 'none'};
`

const ContractCard = styled(Card)`
  margin-top: 0;
  margin-bottom: 0;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`

const ContractWrapper = styled('div')`
  &:not(:first-of-type) {
    margin-top: 5rem;
    border-top: 1px solid ${({ theme }) => theme.border};
    padding-top: 5rem;
  }
`

export const Contract: React.FC<{
  contract: ContractType
  refetch: () => Promise<any>
  shouldPreSelectAgreement: boolean
  focused: boolean
  selected: boolean
}> = ({ contract, refetch, shouldPreSelectAgreement, focused, selected }) => {
  const [selectedAgreement, setSelectedAgreement] = React.useState<
    string | undefined
  >(shouldPreSelectAgreement ? contract.currentAgreementId : undefined)

  const agreementToShow = contract.genericAgreements.find(
    (agreement) => agreement.id === selectedAgreement,
  )

  const { focus, setFocus } = useNavigation()

  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardsRef?.current) {
      return
    }

    if (focused) {
      cardsRef.current.scrollIntoView({
        block: 'center',
      })
      return
    }

    cardsRef.current.blur()
  }, [focused])

  const selectAgreementHandler = (agreementId: string | undefined) => {
    setSelectedAgreement(agreementId)
    if (agreementId) {
      setFocus(FocusItems.Member.items.ContractForm)
    }
  }

  return (
    <ContractWrapper>
      <ContractsCardsWrapper ref={cardsRef} focused={focused}>
        <ContractCard locked={contract.isLocked} span={3}>
          <InfoContainer>
            <ThirdLevelHeadline>
              <InfoRow>{contract.contractTypeName}</InfoRow>
            </ThirdLevelHeadline>
            <InfoRow>
              Holder{' '}
              <InfoText>
                {contract.holderFirstName} {contract.holderLastName}
              </InfoText>
            </InfoRow>
            <InfoRow>
              Status <InfoText>{convertEnumToTitle(contract.status)}</InfoText>
            </InfoRow>
            {contract.switchedFrom && (
              <InfoRow>
                Switched From <InfoText>{contract.switchedFrom}</InfoText>
              </InfoRow>
            )}
            {contract.signSource && (
              <InfoRow>
                Sign Source{' '}
                <InfoText>{getSignSource(contract.signSource)}</InfoText>
              </InfoRow>
            )}
          </InfoContainer>
        </ContractCard>
        <ContractCard locked={contract.isLocked} span={3}>
          <ThirdLevelHeadline>Master Inception</ThirdLevelHeadline>
          <MasterInception contract={contract} />
        </ContractCard>
        <ContractCard locked={contract.isLocked} span={3}>
          <ThirdLevelHeadline>Termination Date</ThirdLevelHeadline>
          <TerminationDate contract={contract} />
        </ContractCard>
      </ContractsCardsWrapper>
      <AgreementsTable
        agreements={contract.genericAgreements}
        selectedAgreement={selectedAgreement}
        setSelectedAgreement={selectAgreementHandler}
        navigationAvailable={
          selected && focus === FocusItems.Member.items.ContractTable
        }
      />
      {agreementToShow && (
        <Agreement
          agreement={agreementToShow}
          contract={contract}
          refetch={refetch}
          navigationAvailable={
            focus === FocusItems.Member.items.ContractForm && selected
          }
        />
      )}
    </ContractWrapper>
  )
}
