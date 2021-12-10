import styled from '@emotion/styled'
import {
  Card,
  CardsWrapper,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { CampaignCodeInput } from 'features/member/tabs/campaigns-tab/campaigns/CampaignCodeInput'
import { CampaignsRedeemedTable } from 'features/member/tabs/campaigns-tab/campaigns/CampaignsRedeemedTable'
import React from 'react'
import { ReferralInformation } from 'types/generated/graphql'

const CampaignCard = styled(Card)<{ focused: boolean }>`
  border-radius: 0.5rem;
  border: ${({ focused, theme }) =>
    focused ? `1px solid ${theme.accent}` : 'none'};
`

const NoRedeemedCampaignsMessage = styled(StandaloneMessage)`
  font-size: 1.2em;
`

export const CampaignsInfo: React.FC<{
  memberId: string
  referralInformation: ReferralInformation
  navigationAvailable: boolean
  focused: boolean
}> = ({ memberId, referralInformation, navigationAvailable, focused }) => {
  return (
    <CardsWrapper>
      <CampaignCard focused={focused}>
        <ThirdLevelHeadline>Redeemed campaigns</ThirdLevelHeadline>
        {referralInformation.redeemedCampaigns.length !== 0 && (
          <CampaignsRedeemedTable
            memberId={memberId}
            campaignsRedeemed={referralInformation.redeemedCampaigns}
          />
        )}

        {referralInformation.redeemedCampaigns.length === 0 && (
          <NoRedeemedCampaignsMessage paddingTop="2em" paddingBottom="2em">
            No campaigns redeemed
          </NoRedeemedCampaignsMessage>
        )}

        <CampaignCodeInput memberId={memberId} focus={navigationAvailable} />
      </CampaignCard>
    </CardsWrapper>
  )
}
