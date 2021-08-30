import {
  CampaignFilter,
  useSetCampaignCodeTypeMutation,
} from 'api/generated/graphql'
import {
  getCodeTypeOptions,
  getDiscountDetails,
  getIncentiveText,
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
  const codeTypeOptions = getCodeTypeOptions()
  const [
    setCodeType,
    { loading: loadingSetCodeType },
  ] = useSetCampaignCodeTypeMutation()

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
                codeType,
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
                        codeType
                          ? codeTypeOptions.find((c) => c.value === codeType)
                          : null
                      }
                      placeholder={'No channel'}
                      isLoading={loadingSetCodeType}
                      onChange={(data) =>
                        toast.promise(
                          setCodeType({
                            variables: { id, codeType: data?.value },
                            optimisticResponse: {
                              setCampaignCodeType: {
                                __typename: 'VoucherCampaign',
                                codeType: data?.value,
                                ...campaign,
                              },
                            },
                          }),
                          {
                            loading: 'Updating code type',
                            success: 'Code type updated',
                            error: 'Could not update code type',
                          },
                        )
                      }
                      noOptionsMessage={() => 'Option not found'}
                      options={codeTypeOptions}
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
