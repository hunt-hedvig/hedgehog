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
import { Agreement } from 'portals/hope/features/member/tabs/contracts-tab/agreement'
import { AgreementsTable } from 'portals/hope/features/member/tabs/contracts-tab/agreement/AgreementsTable'
import { MasterInception } from 'portals/hope/features/member/tabs/contracts-tab/contract/master-inception'
import { TerminationDate } from 'portals/hope/features/member/tabs/contracts-tab/contract/termination-date'
import React from 'react'
import { ExclamationCircle } from 'react-bootstrap-icons'
import { Contract as ContractType } from 'types/generated/graphql'
import { getSignSource } from 'portals/hope/features/member/tabs/contracts-tab/utils'

const Blockers = styled.div`
  list-style: none;

  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.accentLighter};
  padding: 0.625rem;
  border-radius: 0.5rem;

  margin: 0 0 0.5rem;

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
  onRefetch: () => void
  shouldPreSelectAgreement: boolean
  locale: string
}> = ({ contract, onRefetch, shouldPreSelectAgreement, locale }) => {
  const [selectedAgreement, setSelectedAgreement] = React.useState<
    string | undefined
  >(shouldPreSelectAgreement ? contract.currentAgreementId : undefined)

  const agreementToShow = contract.genericAgreements.find(
    (agreement) => agreement.id === selectedAgreement,
  )

  return (
    <ContractWrapper>
      <CardsWrapper>
        <Card locked={contract.isLocked} span={3}>
          <InfoContainer>
            <ThirdLevelHeadline>
              <InfoRow>{contract.contractTypeName}</InfoRow>
            </ThirdLevelHeadline>
            <InfoRow>
              Holder{' '}
              <InfoText>
                {contract.holderMember.firstName}{' '}
                {contract.holderMember.lastName}
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
      </CardsWrapper>
      <AgreementsTable
        agreements={contract.genericAgreements}
        selectedAgreement={selectedAgreement}
        setSelectedAgreement={setSelectedAgreement}
      />
      {!!contract.selfChangeBlockers.length && (
        <Blockers>
          <ExclamationCircle />
          <span>
            Self-change blocker:{' '}
            {contract.selfChangeBlockers.map((blocker, index) => (
              <>
                <strong>{convertEnumToTitle(blocker)}</strong>
                {index !== contract.selfChangeBlockers.length - 1 ? ' & ' : ''}
              </>
            ))}
          </span>
        </Blockers>
      )}
      {agreementToShow && (
        <Agreement
          agreement={agreementToShow}
          contract={contract}
          onRefetch={onRefetch}
          locale={locale}
        />
      )}
    </ContractWrapper>
  )
}
