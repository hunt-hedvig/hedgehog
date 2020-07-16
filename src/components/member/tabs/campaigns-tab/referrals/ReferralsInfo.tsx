import {
  Market,
  MemberReferral,
  ReferralInformation,
} from 'api/generated/graphql'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { Paragraph, ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { EnableReferralButton } from './EnableReferralButton'
import { MembersReferredTable } from './MembersReferredTable'

interface ReferralStatusProps {
  eligible: boolean
}

const ReferralStatusBadge = styled.div<ReferralStatusProps>`
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

const BadgeRow = styled(Paragraph)`
  margin-top: 0.3rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const TableHeadline = styled(ThirdLevelHeadline)`
  margin-bottom: -0.2rem;
`

const NotAvailableLabel = styled.div`
  color: ${({ theme }) => theme.placeholderColor};
`

const SmallTopSpacing = styled.div`
  margin-top: 0.2rem;
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
    <NotAvailableLabel>Not available</NotAvailableLabel>
  </SmallTopSpacing>
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
          <BadgeRow>
            <SmallTopSpacing>Hedvig Forever</SmallTopSpacing>
            {referralInformation ? (
              <ReferralStatusBadge eligible={eligible ?? false}>
                {eligible ? 'Activated' : 'Disabled'}
              </ReferralStatusBadge>
            ) : (
              <NotAvailable />
            )}
          </BadgeRow>
          <BadgeRow>
            <SmallTopSpacing>Referral Code</SmallTopSpacing>
            {eligible ? (
              <CampaignCodeBadge>
                {referralInformation?.campaign.code.toUpperCase()}
              </CampaignCodeBadge>
            ) : (
              <NotAvailable />
            )}
          </BadgeRow>
          <BadgeRow>
            <SmallTopSpacing>Referred By</SmallTopSpacing>
            {eligible && referralInformation?.referredBy ? (
              <MemberLink memberReferral={referralInformation?.referredBy} />
            ) : (
              <NotAvailable />
            )}
          </BadgeRow>
          {!eligible && market && (
            <EnableReferralButton market={market} memberId={memberId} />
          )}
        </Card>
      </CardsWrapper>

      {eligible && (
        <>
          <TableHeadline>Members referred</TableHeadline>
          <MembersReferredTable
            members={referralInformation?.hasReferred ?? []}
          />
        </>
      )}
    </>
  )
}
