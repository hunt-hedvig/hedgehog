import styled from '@emotion/styled'
import { Contract as ContractType } from 'api/generated/graphql'
import { Agreement } from 'components/member/tabs/contracts-tab/agreement'
import { AgreementsTable } from 'components/member/tabs/contracts-tab/agreement/AgreementsTable'
import { MasterInception } from 'components/member/tabs/contracts-tab/contract/master-inception'
import { TerminationDate } from 'components/member/tabs/contracts-tab/contract/termination-date'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { InfoContainer, InfoRow, InfoText } from 'hedvig-ui/info-row'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { LockFill } from 'react-bootstrap-icons'
import { getSignSource } from 'utils/contract'
import { convertEnumToTitle } from 'utils/text'

const ContractWrapper = styled('div')`
  &:not(:first-of-type) {
    margin-top: 5rem;
    border-top: 1px solid ${({ theme }) => theme.border};
    padding-top: 5rem;
  }
`

const LockedOverlay = styled('div')`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(255 255 255 / 70%);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
`

const ContractCard = ({ locked, children, ...cardProps }) => (
  <Card {...cardProps} style={{ position: 'relative' }}>
    {children}
    {locked && (
      <LockedOverlay>
        Locked
        <LockFill />
      </LockedOverlay>
    )}
  </Card>
)

export const Contract: React.FC<{
  contract: ContractType
  refetch: () => Promise<any>
  shouldPreSelectAgreement: boolean
}> = ({ contract, refetch, shouldPreSelectAgreement }) => {
  const [selectedAgreement, setSelectedAgreement] = React.useState<
    string | undefined
  >(shouldPreSelectAgreement ? contract.currentAgreementId : undefined)

  const agreementToShow = contract.genericAgreements.find(
    (agreement) => agreement.id === selectedAgreement,
  )

  return (
    <ContractWrapper>
      <CardsWrapper>
        <ContractCard
          locked={!contract.isLocked}
          style={{ position: 'relative' }}
          span={3}
        >
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
        <Card span={3}>
          <InfoContainer>
            <ThirdLevelHeadline>
              <InfoRow>
                Master Inception
                {!contract.isLocked && <LockFill />}
              </InfoRow>
            </ThirdLevelHeadline>
          </InfoContainer>
          <MasterInception contract={contract} />
        </Card>
        <Card span={3}>
          <InfoContainer>
            <ThirdLevelHeadline>
              <InfoRow>
                Termination Date
                {!contract.isLocked && <LockFill />}
              </InfoRow>
            </ThirdLevelHeadline>
          </InfoContainer>
          <TerminationDate contract={contract} />
        </Card>
      </CardsWrapper>
      <AgreementsTable
        agreements={contract.genericAgreements}
        selectedAgreement={selectedAgreement}
        setSelectedAgreement={setSelectedAgreement}
      />
      {agreementToShow && (
        <Agreement
          agreement={agreementToShow}
          contract={contract}
          refetch={refetch}
        />
      )}
    </ContractWrapper>
  )
}
