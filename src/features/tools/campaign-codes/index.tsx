import { usePartnerCampaigns } from 'graphql/use-partner-campaigns'
import * as React from 'react'
import { Table } from 'semantic-ui-react'
import { Spacing } from '../../../../shared/hedvig-ui/spacing'
import { MainHeadline } from '../../../../shared/hedvig-ui/typography'

export const CampaignCodeInfo: React.FC = () => {
  const [partnerCampaigns, { loading, refetch }] = usePartnerCampaigns()

  return (
    <>
      <MainHeadline>Campaign Codes</MainHeadline>

      <Spacing>
        {loading && 'loading...'}
        {!loading && partnerCampaigns.length === 0 && 'No partner campaigns :('}
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Valid From</Table.HeaderCell>
              <Table.HeaderCell>Valid To</Table.HeaderCell>
              <Table.HeaderCell>Campaign Code</Table.HeaderCell>
              <Table.HeaderCell>Incentive</Table.HeaderCell>
              <Table.HeaderCell>Campaign Owner</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <>
              {partnerCampaigns.map((campaign) => (
                <Table.Row key={campaign.id}>
                  <Table.Cell>{campaign.validFrom ?? '-'}</Table.Cell>
                  <Table.Cell>{campaign.validTo ?? '-'}</Table.Cell>
                  <Table.Cell>{campaign.campaignCode}</Table.Cell>
                  <Table.Cell>"incentive"</Table.Cell>
                  <Table.Cell>{campaign.partnerId}</Table.Cell>
                </Table.Row>
              ))}
            </>
          </Table.Body>
        </Table>
      </Spacing>
    </>
  )
}
