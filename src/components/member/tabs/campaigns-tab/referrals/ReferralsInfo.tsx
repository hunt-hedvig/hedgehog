import { Market, ReferralInformation } from 'api/generated/graphql'
import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/contracts-tab/contract'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { EnableReferralButton } from './EnableReferralButton'
import { MembersReferredTable } from './MembersReferredTable'

interface ForeverStatusProps {
  eligible: boolean
}

const ForeverStatusBadge = styled.div<ForeverStatusProps>`
  padding: 0.5rem 1rem;
  line-height: 1;
  background: ${({ eligible, theme }) =>
    eligible ? theme.success : theme.danger};
  border-radius: 8px;
  color: #fff;
`

const CampaignCodeBadge = styled.div`
  padding: 0.5rem 1rem;
  line-height: 1;
  background: ${({ theme }) => theme.accent};
  border-radius: 8px;
  color: ${({ theme }) => theme.accentContrast};
  font-weight: bold;
`

const NotAvailableLabel = styled.div`
  color: ${({ theme }) => theme.placeholderColor};
`

const NotAvailable: React.FC = () => (
  <NotAvailableLabel>Not available</NotAvailableLabel>
)

export const ReferralsInfo: React.FunctionComponent<{
  memberId: string
  referralInformation: ReferralInformation
  market?: Market
}> = ({ memberId, referralInformation, market }) => {
  const eligible = referralInformation.eligible

  return (
    <>
      <CardsWrapper>
        <Card>
          <InfoContainer>
            <InfoRow>
              <span style={{ marginTop: '0.3rem' }}>Hedvig Forever</span>
              {referralInformation ? (
                <InfoText>
                  <ForeverStatusBadge eligible={eligible ?? false}>
                    {eligible ? 'Activated' : 'Disabled'}
                  </ForeverStatusBadge>
                </InfoText>
              ) : (
                <InfoText style={{ marginTop: '0.3rem' }}>
                  <NotAvailable />
                </InfoText>
              )}
            </InfoRow>
            <InfoRow style={{ marginTop: '0.4rem' }}>
              <span style={{ marginTop: '0.3rem' }}>Referral Code</span>
              {eligible ? (
                <InfoText>
                  <CampaignCodeBadge>
                    {referralInformation?.campaign.code.toUpperCase()}
                  </CampaignCodeBadge>
                </InfoText>
              ) : (
                <InfoText style={{ marginTop: '0.3rem' }}>
                  <NotAvailable />
                </InfoText>
              )}
            </InfoRow>
            <InfoRow style={{ marginTop: '0.4rem' }}>
              <span style={{ marginTop: '0.3rem' }}>Referred By</span>
              {eligible && referralInformation?.referredBy ? (
                <InfoText style={{ marginTop: '0.3rem' }}>
                  <Link
                    to={`/members/${referralInformation.referredBy.memberId}`}
                  >
                    {referralInformation.referredBy.name}
                  </Link>
                </InfoText>
              ) : (
                <InfoText style={{ marginTop: '0.3rem' }}>
                  <NotAvailable />
                </InfoText>
              )}
            </InfoRow>
            {!eligible && market && (
              <EnableReferralButton market={market} memberId={memberId} />
            )}
          </InfoContainer>
        </Card>
      </CardsWrapper>

      {eligible && (
        <>
          <ThirdLevelHeadline style={{ marginBottom: '-0.2rem' }}>
            Members referred
          </ThirdLevelHeadline>
          <MembersReferredTable
            members={referralInformation?.hasReferred ?? []}
          />
        </>
      )}
    </>
  )
}
