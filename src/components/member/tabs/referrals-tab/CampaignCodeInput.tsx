import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Input } from 'hedvig-ui/input'
import React from 'react'

export const CampaignCodeInput: React.FunctionComponent<{}> = () => {
  const [referralCode, setReferralCode] = React.useState('')
  return (
    <>
      <Input
        placeholder={'Campaign code'}
        value={referralCode}
        fullWidth
        onChange={(_e, { value }) => setReferralCode(value)}
      />
      <ButtonsGroup style={{ marginTop: '1.0rem' }}>
        <Button
          variation="primary"
          fullWidth
          onClick={() => console.log('Hello world')}
        >
          Redeem
        </Button>
      </ButtonsGroup>
    </>
  )
}
