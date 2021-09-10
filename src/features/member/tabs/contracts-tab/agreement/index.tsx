import styled from '@emotion/styled'
import {
  Card,
  CardsWrapper,
  InfoRow,
  InfoText,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import { AgreementInfo } from 'features/member/tabs/contracts-tab/agreement/AgreementInfo'
import { FromDate } from 'features/member/tabs/contracts-tab/agreement/FromDate'
import { InsuranceCertificate } from 'features/member/tabs/contracts-tab/agreement/InsuranceCertificate'
import { InsuranceMandate } from 'features/member/tabs/contracts-tab/agreement/InsuranceMandate'
import { ToDate } from 'features/member/tabs/contracts-tab/agreement/ToDate'
import React from 'react'
import {
  AgreementStatus,
  Contract,
  GenericAgreement as AgreementType,
} from 'types/generated/graphql'
import { CreateQuoteFromAgreement } from './CreateQuoteFromAgreement'

const Divider = styled.hr`
  background: transparent;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.borderStrong};
  margin: 2rem 0;
  height: 0;
  width: 100%;
`

export const Agreement: React.FC<{
  agreement: AgreementType
  contract: Contract
  refetch: () => Promise<void>
}> = ({ agreement, contract, refetch }) => {
  return (
    <>
      <CardsWrapper>
        <Card span={2}>
          <AgreementInfo contract={contract} agreement={agreement} />
        </Card>
        {agreement.status !== AgreementStatus.Pending && (
          <>
            <Card span={2}>
              <FromDate agreement={agreement} contract={contract} />
              <Divider />
              <div>
                <ToDate agreement={agreement} contract={contract} />
              </div>
            </Card>
            <Card span={2}>
              <InsuranceCertificate
                contract={contract}
                agreement={agreement}
                refetch={refetch}
              />
            </Card>
          </>
        )}
        <Card span={2}>
          <CreateQuoteFromAgreement agreement={agreement} contract={contract} />
        </Card>

        <Card span={2}>
          <InsuranceMandate contract={contract} />
        </Card>

        <Card span={2}>
          <ThirdLevelHeadline>Debugging</ThirdLevelHeadline>
          <InfoRow>
            Member Id <InfoText>{contract.holderMemberId}</InfoText>
          </InfoRow>
          <InfoRow>
            Contract Id
            <InfoText>{contract.id}</InfoText>
          </InfoRow>
          <InfoRow>
            Contract created at{' '}
            <InfoText>
              {format(parseISO(contract.createdAt), 'yyyy-MM-dd hh:mm:ss')}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Agreement Id <InfoText>{agreement.id}</InfoText>
          </InfoRow>
          <InfoRow>
            Agreement created at{' '}
            <InfoText>
              {format(parseISO(agreement.createdAt), 'yyyy-MM-dd hh:mm:ss')}
            </InfoText>
          </InfoRow>
        </Card>
      </CardsWrapper>
    </>
  )
}
