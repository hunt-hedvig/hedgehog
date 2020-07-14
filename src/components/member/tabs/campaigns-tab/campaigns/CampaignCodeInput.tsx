import {
  GetReferralInformationDocument,
  useManualRedeemCampaignMutation,
} from 'api/generated/graphql'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Input } from 'hedvig-ui/input'
import React from 'react'

export const CampaignCodeInput: React.FunctionComponent<{
  memberId: string
}> = ({ memberId }) => {
  const [referralCode, setReferralCode] = React.useState('')
  const [manualRedeemCampaign] = useManualRedeemCampaignMutation()

  return (
    <>
      <Input
        placeholder={'Campaign code'}
        value={referralCode}
        fullWidth
        error
        onChange={(_e, { value }) => setReferralCode(value)}
      />
      <ButtonsGroup style={{ marginTop: '1.0rem' }}>
        <Button
          variation="primary"
          fullWidth
          onClick={() =>
            manualRedeemCampaign({
              variables: {
                memberId,
                request: { campaignCode: referralCode },
              },
              refetchQueries: () => [{ query: GetReferralInformationDocument }],
            })
              .then(({ data }) => console.log(data))
              .catch((error) => console.log(error))
          }
        >
          Redeem
        </Button>
      </ButtonsGroup>
    </>
  )
}
