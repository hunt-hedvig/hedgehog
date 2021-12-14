import styled from '@emotion/styled'
import {
  Card,
  CardsWrapper,
  InfoContainer,
  InfoRow,
  InfoText,
  OrbIndicator,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { colorsV3 } from '@hedviginsurance/brand'
import { Agreement } from 'features/member/tabs/contracts-tab/agreement'
import { AgreementsTable } from 'features/member/tabs/contracts-tab/agreement/AgreementsTable'
import { MasterInception } from 'features/member/tabs/contracts-tab/contract/master-inception'
import { TerminationDate } from 'features/member/tabs/contracts-tab/contract/termination-date'
import { getSignSource } from 'features/member/tabs/contracts-tab/utils'
import {
  FocusItems,
  useElementFocus,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import React, { useRef, useState } from 'react'
import { Contract as ContractType } from 'types/generated/graphql'

const selfBlockersColors = {
  HAS_TERMINATION: colorsV3.red500,
  HAS_FUTURE_CHANGES: colorsV3.orange,
}

const ContractsCardsWrapper = styled(CardsWrapper)<{ focused: boolean }>`
  position: relative;
  border-radius: 0.5rem;
  border: ${({ focused, theme }) =>
    focused ? `1px solid ${theme.accent}` : 'none'};
`

const BlockersWrapper = styled.ul<{ visible: boolean }>`
  transition: opacity 0.3s;

  opacity: ${({ visible }) => (visible ? '1' : '0')};

  margin: 0;
  padding: 0;
  list-style: none;

  display: flex;

  position: absolute;
  top: -1.7rem;
  right: 0.5rem;
`

const Blocker = styled.li`
  display: flex;
  align-items: center;

  font-size: 12px;
  color: ${({ theme }) => theme.foreground};

  border-radius: 0.5rem;

  &:not(:last-child) {
    margin-right: 1rem;
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
  const [selfBlockersVisible, setSelfBlockersVisible] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState<
    string | undefined
  >(shouldPreSelectAgreement ? contract.currentAgreementId : undefined)

  const agreementToShow = contract.genericAgreements.find(
    (agreement) => agreement.id === selectedAgreement,
  )

  const cardsRef = useRef<HTMLDivElement>(null)

  const { focus, setFocus } = useNavigation()
  useElementFocus(cardsRef, focused)

  const selectAgreementHandler = (agreementId: string | undefined) => {
    setSelectedAgreement(agreementId)
    if (agreementId) {
      setFocus(FocusItems.Member.items.ContractForm)
    }
  }

  return (
    <ContractWrapper>
      <ContractsCardsWrapper
        ref={cardsRef}
        focused={focused}
        onMouseEnter={() => setSelfBlockersVisible(true)}
        onMouseLeave={() => setSelfBlockersVisible(false)}
      >
        <Card locked={contract.isLocked} span={3}>
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
        </Card>
        <Card locked={contract.isLocked} span={3}>
          <ThirdLevelHeadline>Master Inception</ThirdLevelHeadline>
          <MasterInception contract={contract} />
        </Card>
        <Card locked={contract.isLocked} span={3}>
          <ThirdLevelHeadline>Termination Date</ThirdLevelHeadline>
          <TerminationDate contract={contract} />
        </Card>
        {!!contract.selfChangeBlockers.length && (
          <BlockersWrapper visible={selfBlockersVisible}>
            {contract.selfChangeBlockers.map((blocker) => (
              <Blocker key={blocker}>
                <OrbIndicator
                  style={{ marginRight: '0.5rem' }}
                  size="8px"
                  color={selfBlockersColors[blocker]}
                />
                {convertEnumToTitle(blocker)}
              </Blocker>
            ))}
          </BlockersWrapper>
        )}
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
