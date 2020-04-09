import { Contract as ContractType } from 'api/generated/graphql'
import { Agreement } from 'components/member/tabs/contracts-tab/agreement'
import { AgreementsTable } from 'components/member/tabs/contracts-tab/agreement/AgreementsTable'
import { MasterInception } from 'components/member/tabs/contracts-tab/contract/master-inception'
import { TerminationDate } from 'components/member/tabs/contracts-tab/contract/termination-date'
import { useMemberInfo } from 'graphql/use-member-info'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import {
  Paragraph,
  SecondLevelHeadline,
  ThirdLevelHeadline,
} from 'hedvig-ui/typography'
import * as React from 'react'
import styled from 'react-emotion'
import { getSignSource } from 'utils/contract'
import { getEnumTitleCase } from 'utils/enum'

export const InfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const InfoRow = styled(Paragraph)`
  margin-left: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 1.15rem;
  display: inline-block;
`

export const InfoText = styled('span')`
  font-weight: bold;
  margin: 0.5rem;
`

export const Contract: React.FunctionComponent<{
  contract: ContractType
  refetch: () => Promise<any>
}> = ({ contract, refetch }) => {
  const [focusedAgreement, setFocusedAgreement] = React.useState<string>(
    contract.currentAgreementId,
  )

  const [member, { loading }] = useMemberInfo(contract.holderMemberId)

  if (loading) {
    return null
  }

  return (
    <>
      <CardsWrapper>
        <Card>
          <SecondLevelHeadline>{contract.contractTypeName}</SecondLevelHeadline>
        </Card>
        {member && (
          <Card span={2}>
            <InfoContainer>
              <InfoRow>
                Holder:{' '}
                <InfoText>
                  {member.firstName} {member.lastName}
                </InfoText>
              </InfoRow>
              <InfoRow>
                Status: <InfoText>{getEnumTitleCase(contract.status)}</InfoText>
              </InfoRow>
              {contract.switchedFrom && (
                <InfoRow>
                  Switched from: <InfoText>{contract.switchedFrom}</InfoText>
                </InfoRow>
              )}
              {contract.signSource && (
                <InfoRow>
                  Sign source:{' '}
                  <InfoText>{getSignSource(contract.signSource)}</InfoText>
                </InfoRow>
              )}
            </InfoContainer>
          </Card>
        )}
        <Card span={4}>
          <ThirdLevelHeadline>Master Inception</ThirdLevelHeadline>
          <MasterInception contract={contract} />
        </Card>
        <Card span={4}>
          <ThirdLevelHeadline>Termination Date</ThirdLevelHeadline>
          <TerminationDate contract={contract} />
        </Card>
      </CardsWrapper>
      <AgreementsTable
        agreements={contract.agreements}
        currentAgreement={contract.currentAgreementId}
        focusedAgreement={focusedAgreement}
        setFocusedAgreement={setFocusedAgreement}
      />
      <Agreement
        agreement={
          contract.agreements.find(
            (agreement) => agreement.id === focusedAgreement,
          )!
        }
        contract={contract}
        refetch={refetch}
      />
    </>
  )
}
