import {
  CampaignFilter,
  useSetCampaignMarketingChannelMutation,
} from 'api/generated/graphql'
import {
  getDiscountDetails,
  getIncentiveText,
  getMarketingChannelOptions,
  getValidity,
} from 'features/tools/campaign-codes/utils'
import { usePartnerCampaigns } from 'graphql/use-partner-campaigns'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import { Card } from 'hedvig-ui/card'
import { Popover } from 'hedvig-ui/popover'
import { SearchableDropdown } from 'hedvig-ui/searchable-dropdown'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Table } from 'semantic-ui-react'

export const CampaignCodeTable: React.FC<{ filter: CampaignFilter }> = ({
  filter,
}) => {
  const [partnerCampaigns, { loading }] = usePartnerCampaigns(filter)
  const marketingChannelOptions = getMarketingChannelOptions()
  const [
    setMarketingChannel,
    { loading: loadingSetMarketingChannel },
  ] = useSetCampaignMarketingChannelMutation()

  if (loading) {
    return (
      <Card span={1}>
        <LoadingMessage />
      </Card>
    )
  }

  if (partnerCampaigns.length === 0) {
    return (
      <Card span={1}>
        <StandaloneMessage>No campaigns found</StandaloneMessage>
      </Card>
    )
  }

  return (
    <Card span={1}>
      <Table celled style={{ fontSize: '1.0rem', overflow: 'visible' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center" width={3}>
              Valid Period
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="left">Campaign Code</Table.HeaderCell>
            <Table.HeaderCell textAlign={'center'}>
              Campaign Owner
            </Table.HeaderCell>
            <Table.HeaderCell textAlign={'center'}>
              Incentive Type
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center" width={3}>
              Discount
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">
              Marketing Channel
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <>
            {partnerCampaigns.map((campaign) => {
              const {
                id,
                campaignCode,
                incentive,
                partnerId,
                partnerName,
                marketingChannel,
              } = campaign

              return (
                <Table.Row key={id}>
                  <Table.Cell textAlign="center">
                    {getValidity(campaign)}
                  </Table.Cell>
                  <Table.Cell textAlign={'center'}>{campaignCode}</Table.Cell>
                  <Table.Cell textAlign={'center'}>
                    <Popover contents={partnerId}>{partnerName}</Popover>
                  </Table.Cell>
                  <Table.Cell width={3} textAlign={'center'}>
                    {getIncentiveText(incentive)}
                  </Table.Cell>
                  <Table.Cell width={3} textAlign={'center'}>
                    {getDiscountDetails(incentive)}
                  </Table.Cell>
                  <Table.Cell width={3} textAlign={'center'}>
                    <SearchableDropdown
                      value={
                        marketingChannel
                          ? {
                              value: marketingChannel,
                              label: marketingChannel,
                            }
                          : null
                      }
                      placeholder={'No channel'}
                      isLoading={loadingSetMarketingChannel}
                      isClearable={true}
                      onChange={(data) =>
                        toast.promise(
                          setMarketingChannel({
                            variables: { id, marketingChannel: data?.value },
                            optimisticResponse: {
                              setCampaignMarketingChannel: {
                                __typename: 'VoucherCampaign',
                                marketingChannel: data?.value,
                                ...campaign,
                              },
                            },
                          }),
                          {
                            loading: 'Updating marketing channel',
                            success: 'Marketing channel updated',
                            error: 'Could not update marketing channel',
                          },
                        )
                      }
                      noOptionsMessage={() => 'Option not found'}
                      options={marketingChannelOptions}
                    />
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
