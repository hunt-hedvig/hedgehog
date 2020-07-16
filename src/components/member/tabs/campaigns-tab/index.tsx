import { ContractMarketInfo } from 'api/generated/graphql'
import { CampaignsInfo } from 'components/member/tabs/campaigns-tab/campaigns/CampaignsInfo'
import { ReferralsInfo } from 'components/member/tabs/campaigns-tab/referrals/ReferralsInfo'
import { useGetReferralInformation } from 'graphql/use-get-referral-information'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'
import styled, { css, keyframes } from 'react-emotion'

const Headline = styled(MainHeadline)`
  display: flex;
  align-items: center;
`

const spin = keyframes`
  from{transform: rotate(0deg)}
  to{transform: rotate(360deg)}
`
const RefreshButton = styled.button<{ loading: boolean }>`
  background: transparent;
  font-size: 0.875em;
  color: ${({ theme }) => theme.mutedText};
  padding: 0;
  border: 0;
  margin-left: 1rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: transform 500ms;
  ${({ loading }) =>
    loading &&
    css`
      animation: ${spin} 500ms linear infinite;
    `};
`

export const CampaignsTab: React.FunctionComponent<{
  memberId: string
  contractMarketInfo: ContractMarketInfo
}> = ({ memberId, contractMarketInfo }) => {
  const [
    referralInformation,
    { loading, error, refetch },
  ] = useGetReferralInformation(memberId)

  if (loading) {
    return (
      <>
        <Headline>Campaigns</Headline>
        Loading...
      </>
    )
  }

  if (error || !referralInformation) {
    return (
      <>
        <Headline>
          Campaigns
          <RefreshButton onClick={() => refetch()} loading={loading}>
            <ArrowRepeat />
          </RefreshButton>
        </Headline>
        Something went wrong!
      </>
    )
  }

  return (
    <>
      <Headline>
        Campaigns
        <RefreshButton onClick={() => refetch()} loading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </Headline>
      <CampaignsInfo
        memberId={memberId}
        referralInformation={referralInformation}
      />

      <Headline>Referrals</Headline>
      <ReferralsInfo
        memberId={memberId}
        referralInformation={referralInformation}
        market={contractMarketInfo?.market}
      />
    </>
  )
}
