import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/contracts-tab/contract'
import { CampaignCodeInput } from 'components/member/tabs/referrals-tab/CampaignCodeInput'
import { CampaignsRedeemedTable } from 'components/member/tabs/referrals-tab/CampaignsRedeemedTable'
import { MembersReferredTable } from 'components/member/tabs/referrals-tab/MembersReferredTable'
import { useGetReferralInformation } from 'graphql/use-get-referral-information'
import { Button } from 'hedvig-ui/button'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { MainHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

const Headline = styled(MainHeadline)`
  display: flex;
  align-items: center;
`

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

export const ReferralsTab: React.FunctionComponent<{ memberId: string }> = ({
  memberId,
}) => {
  const [referralInformation] = useGetReferralInformation(memberId)
  const eligible = referralInformation?.eligible

  return (
    <>
      <Headline>Campaigns</Headline>

      {/*
      <ThirdLevelHeadline style={{ marginBottom: '-0.2rem' }}>
        Redeemed campaigns
      </ThirdLevelHeadline>
      <CampaignsRedeemedTable />
      */}
      <CardsWrapper>
        <Card>
          <CampaignCodeInput />
        </Card>
      </CardsWrapper>

      <Headline>Referrals</Headline>
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
            {!eligible && (
              <Button
                variation="primary"
                fullWidth
                onClick={() => console.log('Hello world')}
                style={{
                  marginTop: '1.6rem',
                }}
              >
                Activate Hedvig Forever
              </Button>
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
