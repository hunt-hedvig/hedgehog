import { CampaignFilter } from 'api/generated/graphql'
import {
  getDiscountDetails,
  getIncentiveText,
  getValidity,
} from 'features/tools/campaign-codes/utils'
import { usePartnerCampaigns } from 'graphql/use-partner-campaigns'
import { Card } from 'hedvig-ui/card'
import { Popover } from 'hedvig-ui/popover'
import React from 'react'
import { Table } from 'semantic-ui-react'

export const CampaignCodeTable: React.FC<{ filter: CampaignFilter }> = ({
  filter,
}) => {
  const [partnerCampaigns, { loading }] = usePartnerCampaigns(filter)

  if (loading) {
    return <Card span={1}>Loading employees...</Card>
  }

  if (partnerCampaigns.length === 0) {
    return <Card span={1}>No employees exist in the database</Card>
  }

  return (
    <Card span={1}>
      <Table celled style={{ fontSize: '1.0rem' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="left">Name</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>First granted at</Table.HeaderCell>
            <Table.HeaderCell>Removed at</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <>
            {partnerCampaigns.map((employee) => {
              const { name, email, role, partnerName } = employee

              return (
                <Table.Row key={employee.email}>
                  <Table.Cell>{getValidity(employee)}</Table.Cell>
                  <Table.Cell>{campaignCode}</Table.Cell>
                  <Table.Cell>
                    <Popover contents={partnerId}>{partnerName}</Popover>
                  </Table.Cell>
                  <Table.Cell width={3}>
                    {getIncentiveText(incentive)}
                  </Table.Cell>
                  <Table.Cell width={3}>
                    {getDiscountDetails(incentive)}
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </>
        </Table.Body>
      </Table>
    </Card>
  )
}
