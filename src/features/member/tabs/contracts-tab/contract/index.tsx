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
import { ExclamationCircle } from 'react-bootstrap-icons'
import { Contract as ContractType } from 'types/generated/graphql'

const blockersTranslates = {
  HAS_TERMINATION: 'terminating contracts',
  HAS_FUTURE_CHANGES: 'making future changes',
}

const ContractsCardsWrapper = styled(CardsWrapper)<{ focused: boolean }>`
  border-radius: 0.5rem;
  border: ${({ focused, theme }) =>
    focused ? `1px solid ${theme.accent}` : 'none'};
`

const Blockers = styled.div`
  margin: 0;
  padding: 0;
  list-style: none;

  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.accentLighter ?? colorsV3.white};
  padding: 0.625rem;
  border-radius: 0.5rem;

  margin-bottom: 0.5rem;

  & span {
    margin-left: 0.5rem;
    font-size: 12px;
    line-height: 0;
    color: ${({ theme }) => theme.semiStrongForeground};
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
      {!!contract.selfChangeBlockers.length && (
        <Blockers>
          <ExclamationCircle />
          <span>
            This member has issues in{' '}
            {contract.selfChangeBlockers.map((blocker, index) => (
              <>
                <strong>
                  {blockersTranslates[blocker] || convertEnumToTitle(blocker)}
                </strong>
                {index !== contract.selfChangeBlockers.length - 1
                  ? ' and '
                  : ''}
              </>
            ))}{' '}
            on his/her own
          </span>
        </Blockers>
      )}
      <ContractsCardsWrapper ref={cardsRef} focused={focused}>
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
