import {
  Market,
  MemberReferral,
  ReferralInformation,
} from 'api/generated/graphql'
import {
  BadgeRow,
  SmallTopSpacing,
  TableHeadline,
} from 'components/member/tabs/campaigns-tab/styles'
import { Badge } from 'hedvig-ui/badge'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { Capitalized, Placeholder } from 'hedvig-ui/typography'
import React from 'react'
import { Link } from 'react-router-dom'
import { EnableReferralButton } from './EnableReferralButton'
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
