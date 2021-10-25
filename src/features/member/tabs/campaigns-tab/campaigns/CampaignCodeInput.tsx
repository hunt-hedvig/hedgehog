import { Button, Flex, Input, Spacing, TextDatePicker } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/utils/modal-hook'
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
      <Flex direction="row" justify="space-between">
        <Input
          placeholder="Campaign code"
          value={campaignCode}
          onChange={({ target: { value } }) => {
            setCampaignCode(value)
          }}
        />
        {activationDate && (
          <>
            <div>
              <Spacing left="small" right="small">
                <TextDatePicker
                  onChange={setActivationDate}
                  value={activationDate ?? new Date()}
                />
              </Spacing>
            </div>
            <Button variant="secondary" onClick={() => setActivationDate(null)}>
              Remove
            </Button>
          </>
        )}
      </Flex>
      <Spacing top />
      <Flex>
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
        {!activationDate && campaignCode && (
          <Button
            variant="tertiary"
            onClick={() => setActivationDate(new Date())}
          >
            Add activation date
          </Button>
        )}
      </Flex>
    </>
  )
}
