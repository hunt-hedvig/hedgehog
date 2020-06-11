import { Contract as ContractType } from 'api/generated/graphql'
import { Agreement } from 'components/member/tabs/contracts-tab/agreement'
import { AgreementsTable } from 'components/member/tabs/contracts-tab/agreement/AgreementsTable'
import { MasterInception } from 'components/member/tabs/contracts-tab/contract/master-inception'
import { TerminationDate } from 'components/member/tabs/contracts-tab/contract/termination-date'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { Paragraph, ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import { getSignSource } from 'utils/contract'
import { getEnumTitleCase } from 'utils/text'

const ContractWrapper = styled('div')`
  &:not(:first-of-type) {
    margin-top: 5rem;
    border-top: 1px solid ${({ theme }) => theme.border};
    padding-top: 5rem;
  }
`

export const InfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const InfoRow = styled(Paragraph)`
  margin-bottom: 0.25rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const InfoText = styled('span')`
  color: ${({ theme }) => theme.foreground};
`

export const Contract: React.FunctionComponent<{
  contract: ContractType
  refetch: () => Promise<any>
  shouldPreSelectAgreement: boolean
}> = ({ contract, refetch, shouldPreSelectAgreement }) => {
  const [selectedAgreement, setSelectedAgreement] = React.useState<
    string | undefined
  >(shouldPreSelectAgreement ? contract.currentAgreementId : undefined)

  const agreementToShow = contract.agreements.find(
    (agreement) => agreement.id === selectedAgreement,
  )

  return (
    <ContractWrapper>
      <CardsWrapper>
        <Card span={3}>
          <InfoContainer>
            <InfoRow>
              <ThirdLevelHeadline>
                {contract.contractTypeName}
              </ThirdLevelHeadline>
            </InfoRow>
            <InfoRow>
              Holder{' '}
              <InfoText>
                {contract.holderFirstName} {contract.holderLastName}
              </InfoText>
            </InfoRow>
            <InfoRow>
              Status <InfoText>{getEnumTitleCase(contract.status)}</InfoText>
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
        <Card span={3}>
          <ThirdLevelHeadline>Master Inception</ThirdLevelHeadline>
          <MasterInception contract={contract} />
        </Card>
        <Card span={3}>
          <ThirdLevelHeadline>Termination Date</ThirdLevelHeadline>
          <TerminationDate contract={contract} />
        </Card>
      </CardsWrapper>
      <AgreementsTable
        agreements={contract.agreements}
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
