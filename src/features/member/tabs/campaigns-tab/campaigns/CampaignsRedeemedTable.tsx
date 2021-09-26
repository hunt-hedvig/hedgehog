import { Button, Capitalized } from '@hedvig-ui'
import { format } from 'date-fns'
import React from 'react'
import { Table } from 'semantic-ui-react'
import {
  RedeemedCampaign,
  useManualUnRedeemCampaignMutation,
} from 'types/generated/graphql'
import { useConfirmDialog } from 'utils/hooks/modal-hook'

export const CampaignsRedeemedTable: React.FC<{
  memberId: string
  campaignsRedeemed: RedeemedCampaign[]
}> = ({ memberId, campaignsRedeemed }) => {
  const [
    manualUnRedeemCampaign,
    { loading },
  ] = useManualUnRedeemCampaignMutation()
  const { confirm } = useConfirmDialog()

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={6}>Code</Table.HeaderCell>
          <Table.HeaderCell width={6}>Type</Table.HeaderCell>
          <Table.HeaderCell width={6}>Incentive</Table.HeaderCell>
          <Table.HeaderCell width={6}>Redeemed at</Table.HeaderCell>
          <Table.HeaderCell width={6} />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {campaignsRedeemed.map(
          (campaign) =>
            !campaign.redemptionState.unRedeemedAt && (
              <Table.Row>
                <Table.Cell width={6}>{campaign.code.toUpperCase()}</Table.Cell>
                <Table.Cell width={6}>
                  <Capitalized>{campaign.type}</Capitalized>
                </Table.Cell>
                <Table.Cell width={6}>
                  {campaign.incentive.__typename}
                </Table.Cell>
                <Table.Cell>
                  {format(
                    new Date(campaign.redemptionState.redeemedAt),
                    'yyyy-MM-dd',
                  )}
                </Table.Cell>
                <Table.Cell width={6}>
                  <Button
                    disabled={loading}
                    onClick={() => {
                      confirm(
                        `Are you sure you want to unredeem the campaign ${campaign.code.toUpperCase()}?`,
                      ).then(() => {
                        manualUnRedeemCampaign({
                          variables: {
                            memberId,
                            request: { campaignCode: campaign.code },
                          },
                          refetchQueries: () => ['GetReferralInformation'],
                        })
                      })
                    }}
                  >
                    Unredeem
                  </Button>
                </Table.Cell>
              </Table.Row>
            ),
        )}
      </Table.Body>
    </Table>
  )
}
