import styled from '@emotion/styled'
import {
  Card,
  CardsWrapper,
  InfoRow,
  InfoTag,
  InfoText,
  Placeholder,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { SmallTopSpacing } from 'features/member/tabs/campaigns-tab/styles'
import React from 'react'
import { Link } from 'react-router-dom'
import { MemberReferral, ReferralInformation } from 'types/generated/graphql'
import { MembersReferredTable } from './MembersReferredTable'

const CampaignCard = styled(Card)<{ focused: boolean }>`
  border-radius: 0.5rem;
  border: ${({ focused, theme }) =>
    focused ? `1px solid ${theme.accent}` : 'none'};
`

const MemberLink: React.FC<{ memberReferral: MemberReferral }> = ({
  memberReferral,
}) => {
  return (
    <SmallTopSpacing>
      <Link to={`/members/${memberReferral.memberId}`}>
        {memberReferral.name}
      </Link>
    </SmallTopSpacing>
  )
}

const NotAvailable: React.FC = () => (
  <SmallTopSpacing>
    <Placeholder>Not available</Placeholder>
  </SmallTopSpacing>
)

const NoMembersReferredMessage = styled(StandaloneMessage)`
  font-size: 1.2em;
`

export const ReferralsInfo: React.FC<{
  referralInformation: ReferralInformation
  navStep: number
  navigationAvailable: boolean
}> = ({ referralInformation, navStep, navigationAvailable }) => {
  const { eligible } = referralInformation

  return (
    <>
      <CardsWrapper>
        <CampaignCard focused={navigationAvailable && navStep + 1 === 1}>
          <ThirdLevelHeadline>Referral Information</ThirdLevelHeadline>
          <InfoRow>
            Hedvig Forever
            <InfoText>
              {referralInformation ? (
                <InfoTag status={eligible ? 'success' : 'danger'}>
                  <span style={{ fontWeight: 'bold' }}>
                    {eligible ? 'Activated' : 'Disabled'}
                  </span>
                </InfoTag>
              ) : (
                <NotAvailable />
              )}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Referral code
            <InfoText>
              {eligible ? (
                <InfoTag status="highlight">
                  <span style={{ fontWeight: 'bold' }}>
                    {referralInformation?.campaign.code.toUpperCase()}
                  </span>
                </InfoTag>
              ) : (
                <NotAvailable />
              )}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Referred by
            <InfoText>
              {eligible && referralInformation?.referredBy ? (
                <MemberLink memberReferral={referralInformation?.referredBy} />
              ) : (
                <NotAvailable />
              )}
            </InfoText>
          </InfoRow>
        </CampaignCard>
      </CardsWrapper>

      {eligible && (
        <CardsWrapper>
          <CampaignCard focused={navigationAvailable && navStep + 1 === 2}>
            <ThirdLevelHeadline>Members referred</ThirdLevelHeadline>
            {referralInformation?.hasReferred?.length !== 0 ? (
              <MembersReferredTable members={referralInformation.hasReferred} />
            ) : (
              <NoMembersReferredMessage paddingTop="2em" paddingBottom="2em">
                No members referred
              </NoMembersReferredMessage>
            )}
          </CampaignCard>
        </CardsWrapper>
      )}
    </>
  )
}
