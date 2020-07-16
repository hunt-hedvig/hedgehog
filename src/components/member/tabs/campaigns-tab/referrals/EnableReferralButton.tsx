import {
  Market,
  useManualRedeemEnableReferralsCampaignMutation,
} from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import { Spacing } from 'hedvig-ui/spacing'
import React from 'react'
import styled from 'react-emotion'
import { Message } from 'semantic-ui-react'

const FullWidthMessage = styled(Message)`
  width: 100%;
`

export const EnableReferralButton: React.FunctionComponent<{
  memberId: string
  market: Market
}> = ({ memberId, market }) => {
  const [
    enableReferralsCampaign,
    { loading, error },
  ] = useManualRedeemEnableReferralsCampaignMutation()

  return (
    <>
      <Spacing top />
      <Button
        variation="primary"
        fullWidth
        loading={loading}
        onClick={() => {
          const confirm = window.confirm(
            'Are you sure you want to activate referrals for this member?',
          )
          if (confirm) {
            enableReferralsCampaign({
              variables: {
                memberId,
                market,
              },
              refetchQueries: () => ['GetReferralInformation'],
            }).then()
          }
        }}
      >
        Activate Hedvig Forever
      </Button>
      {error && <FullWidthMessage error header="Could not activate member" />}
    </>
  )
}
