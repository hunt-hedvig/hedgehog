import styled from '@emotion/styled'
import {
  Card,
  LoadingMessage,
  Popover,
  SearchableDropdown,
  StandaloneMessage,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import {
  getCodeTypeOptions,
  getDiscountDetails,
  getIncentiveText,
  getValidity,
} from 'features/tools/campaign-codes/utils'
import { usePartnerCampaigns } from 'graphql/use-partner-campaigns'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  CampaignFilter,
  useSetCampaignCodeTypeMutation,
} from 'types/generated/graphql'

const CenteredCell = styled(TableColumn)`
  text-align: center;
`

const HeaderCenteredCell = styled(TableHeaderColumn)`
  text-align: center;
`

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
      <Table style={{ fontSize: '1.0rem', overflow: 'visible' }}>
        <TableHeader>
          <HeaderCenteredCell>Valid Period</HeaderCenteredCell>
          <HeaderCenteredCell>Campaign Code</HeaderCenteredCell>
          <HeaderCenteredCell>Campaign Owner</HeaderCenteredCell>
          <HeaderCenteredCell style={{ width: '270px' }}>
            Incentive Type
          </HeaderCenteredCell>
          <HeaderCenteredCell style={{ width: '270px' }}>
            Discount
          </HeaderCenteredCell>
          <HeaderCenteredCell style={{ width: '270px' }}>
            Code Type
          </HeaderCenteredCell>
        </TableHeader>
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
              <TableRow key={id} border>
                <CenteredCell>{getValidity(campaign)}</CenteredCell>
                <CenteredCell>{campaignCode}</CenteredCell>
                <CenteredCell>
                  <Popover contents={partnerId}>{partnerName}</Popover>
                </CenteredCell>
                <CenteredCell style={{ width: '270px' }}>
                  {getIncentiveText(incentive)}
                </CenteredCell>
                <CenteredCell style={{ width: '270px' }}>
                  {getDiscountDetails(incentive)}
                </CenteredCell>
                <CenteredCell style={{ width: '270px' }}>
                  <SearchableDropdown
                    value={
                      codeType
                        ? codeTypeOptions.find((c) => c.value === codeType)
                        : null
                    }
                    placeholder="No channel"
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
                </CenteredCell>
              </TableRow>
            )
          })}
        </>
      </Table>
    </Card>
  )
}
