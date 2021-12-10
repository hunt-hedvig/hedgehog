import {
  FadeIn,
  LoadingMessage,
  MainHeadline,
  StandaloneMessage,
} from '@hedvig-ui'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { CampaignsInfo } from 'features/member/tabs/campaigns-tab/campaigns/CampaignsInfo'
import { useGetReferralInformation } from 'features/member/tabs/campaigns-tab/hooks/use-get-referral-information'
import { ReferralsInfo } from 'features/member/tabs/campaigns-tab/referrals/ReferralsInfo'
import { RefreshButton } from 'features/member/tabs/shared/refresh-button'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'
import {
  FocusItems,
  useFocus,
  useOldNavigation,
} from '../../../navigation/hooks/use-old-navigation'

export const CampaignsTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [
    referralInformation,
    { loading, error, refetch },
  ] = useGetReferralInformation(memberId)

  const { focus, setFocus } = useOldNavigation()
  useFocus(FocusItems.Member.items.Campaigns)

  const [navigationStep] = useArrowKeyboardNavigation({
    maxStep: 1,
    onPerformNavigation: (index) => {
      if (index + 1 === 0) {
        setFocus(FocusItems.Member.items.CampaignsRedeem)
      }
    },
    isActive: focus === FocusItems.Member.items.Campaigns,
    withNegative: true,
    direction: 'vertical',
  })

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (error || !referralInformation) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Something went wrong
      </StandaloneMessage>
    )
  }

  return (
    <FadeIn>
      <MainHeadline>
        Campaigns
        <RefreshButton onClick={() => refetch()} isloading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </MainHeadline>
      <CampaignsInfo
        focused={navigationStep + 1 === 0}
        navigationAvailable={focus === FocusItems.Member.items.CampaignsRedeem}
        memberId={memberId}
        referralInformation={referralInformation}
      />

      <ReferralsInfo
        referralInformation={referralInformation}
        navStep={navigationStep}
        navigationAvailable={focus === FocusItems.Member.items.Campaigns}
      />
    </FadeIn>
  )
}
