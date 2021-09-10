import { Badge, Capitalized, Card, CardsWrapper, Placeholder } from '@hedvig-ui'
import {
  BadgeRow,
  SmallTopSpacing,
  TableHeadline,
} from 'features/member/tabs/campaigns-tab/styles'
import React from 'react'
import { Link } from 'react-router-dom'
import { MemberReferral, ReferralInformation } from 'types/generated/graphql'
import { MembersReferredTable } from './MembersReferredTable'

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

export const ReferralsInfo: React.FC<{
  referralInformation: ReferralInformation
}> = ({ referralInformation }) => {
  const eligible = referralInformation.eligible

  return (
    <>
      <CardsWrapper>
        <Card>
          <BadgeRow>
            <SmallTopSpacing>Hedvig Forever</SmallTopSpacing>
            {referralInformation ? (
              <Badge size="small" variant={eligible ? 'success' : 'danger'}>
                <Capitalized>{eligible ? 'Activated' : 'Disabled'}</Capitalized>
              </Badge>
            ) : (
              <NotAvailable />
            )}
          </BadgeRow>
          <BadgeRow>
            <SmallTopSpacing>Referral Code</SmallTopSpacing>
            {eligible ? (
              <Badge size="medium" bold>
                {referralInformation?.campaign.code.toUpperCase()}
              </Badge>
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
