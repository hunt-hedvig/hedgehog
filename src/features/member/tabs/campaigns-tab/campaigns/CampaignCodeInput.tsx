import { Button, DateTimePicker, Input } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/utils/modal-hook'
import { Group } from 'features/member/tabs/campaigns-tab/styles'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useManualRedeemCampaignMutation } from 'types/generated/graphql'

export const CampaignCodeInput: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [campaignCode, setCampaignCode] = React.useState('')
  const [activationDate, setActivationDate] = React.useState<Date | null>(null)
  const [manualRedeemCampaign, { loading }] = useManualRedeemCampaignMutation()
  const { confirm } = useConfirmDialog()

  return (
    <>
      <Group>
        <Input
          placeholder="Campaign code"
          value={campaignCode}
          onChange={({ target: { value } }) => {
            setCampaignCode(value)
          }}
        />
        {activationDate && (
          <>
            <DateTimePicker
              date={activationDate ?? new Date()}
              setDate={setActivationDate}
            />
            <Button
              variant="secondary"
              style={{ width: '15%' }}
              onClick={() => setActivationDate(null)}
            >
              Remove
            </Button>
          </>
        )}
      </Group>
      <Group style={{ marginTop: '1.0rem' }}>
        <Button
          disabled={campaignCode === '' || loading}
          onClick={() => {
            confirm(
              `Are you sure you want to redeem the campaign code ${campaignCode.toUpperCase()}?`,
            )
            if (confirm) {
              toast.promise(
                manualRedeemCampaign({
                  variables: {
                    memberId,
                    request: { campaignCode, activationDate },
                  },
                  refetchQueries: () => ['GetReferralInformation'],
                }),
                {
                  loading: 'Redeeming campaign',
                  success: () => {
                    setCampaignCode('')
                    return 'Campaign redeemed'
                  },
                  error: 'Could not redeem campaign',
                },
              )
            }
          }}
        >
          Redeem
        </Button>
        {!activationDate && (
          <Button
            variant="tertiary"
            onClick={() => setActivationDate(new Date())}
          >
            Add activation date
          </Button>
        )}
      </Group>
    </>
  )
}
