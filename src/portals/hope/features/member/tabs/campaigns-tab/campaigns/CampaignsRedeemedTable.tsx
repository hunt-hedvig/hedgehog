import {
  Button,
  Capitalized,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { format } from 'date-fns'
import React from 'react'
import {
  RedeemedCampaign,
  useManualUnRedeemCampaignMutation,
} from 'types/generated/graphql'

export const CampaignsRedeemedTable: React.FC<{
  memberId: string
  campaignsRedeemed: RedeemedCampaign[]
}> = ({ memberId, campaignsRedeemed }) => {
  const [manualUnRedeemCampaign, { loading }] =
    useManualUnRedeemCampaignMutation()
  const { confirm } = useConfirmDialog()

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Code</TableHeaderColumn>
        <TableHeaderColumn>Type</TableHeaderColumn>
        <TableHeaderColumn>Incentive</TableHeaderColumn>
        <TableHeaderColumn>Redeemed at</TableHeaderColumn>
        <TableHeaderColumn />
      </TableHeader>

      {campaignsRedeemed.map(
        (campaign) =>
          !campaign.redemptionState.unRedeemedAt && (
            <TableRow border>
              <TableColumn>{campaign.code.toUpperCase()}</TableColumn>
              <TableColumn>
                <Capitalized>{campaign.type}</Capitalized>
              </TableColumn>
              <TableColumn>{campaign.incentive.__typename}</TableColumn>
              <TableColumn>
                {format(
                  new Date(campaign.redemptionState.redeemedAt),
                  'yyyy-MM-dd',
                )}
              </TableColumn>
              <TableColumn>
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
              </TableColumn>
            </TableRow>
          ),
      )}
    </Table>
  )
}
