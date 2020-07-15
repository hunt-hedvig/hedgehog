import {
  Market,
  useManualRedeemEnableReferralsCampaignMutation,
} from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import React from 'react'
import { Message } from 'semantic-ui-react'

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
        style={{
          marginTop: '1.6rem',
        }}
      >
        Activate Hedvig Forever
      </Button>
      {error && (
        <Message
          error
          style={{ width: '100%' }}
          header="Could not activate member"
        />
      )}
    </>
  )
}
