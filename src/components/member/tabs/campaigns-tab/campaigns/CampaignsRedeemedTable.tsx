import {
  RedeemedCampaign,
  useManualUnRedeemCampaignMutation,
} from 'api/generated/graphql'
import { Capitalized } from 'components/member/tabs/campaigns-tab/referrals/MembersReferredTable'
import { format } from 'date-fns'
import { Button } from 'hedvig-ui/button'
import React from 'react'
import { Table } from 'semantic-ui-react'

export const CampaignsRedeemedTable: React.FunctionComponent<{
  memberId: string
  campaignsRedeemed: RedeemedCampaign[]
}> = ({ memberId, campaignsRedeemed }) => {
  const [
    manualUnRedeemCampaign,
    { loading },
  ] = useManualUnRedeemCampaignMutation()
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
                    variation="primary"
                    fullWidth
                    disabled={loading}
                    onClick={() => {
                      const confirm = window.confirm(
                        `Are you sure you want to unredeem the campaign ${campaign.code.toUpperCase()}?`,
                      )
                      if (confirm) {
                        manualUnRedeemCampaign({
                          variables: {
                            memberId,
                            request: { campaignCode: campaign.code },
                          },
                          refetchQueries: () => ['GetReferralInformation'],
                        })
                      }
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
