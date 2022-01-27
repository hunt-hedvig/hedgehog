import styled from '@emotion/styled'
import {
  Card,
  LoadingMessage,
  SearchableDropdown,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { usePartnerCampaigns } from 'portals/hope/features/tools/campaign-codes/hooks/use-partner-campaigns'
import { usePartnerCampaignOwners } from 'portals/hope/features/tools/campaign-codes/hooks/use-get-partner-campaign-owners'
import {
  getCodeTypeOptions,
  getDiscountDetails,
  getIncentiveText,
  getValidity,
  mapCampaignOwners,
} from 'portals/hope/features/tools/campaign-codes/utils'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  CampaignFilter,
  useSetCampaignCodeTypeMutation,
  useSetCampaignOwnerMutation,
} from 'types/generated/graphql'
import { css } from '@emotion/react'
import { PencilFill } from 'react-bootstrap-icons'

const CenteredCell = styled(TableColumn)<{ editable?: boolean }>`
  text-align: center;
  height: 6rem;

  ${({ editable }) =>
    editable &&
    css`
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;

      .edit-icon {
        opacity: 0;
        margin-left: 1rem;
      }

      :hover {
        .edit-icon {
          opacity: 1;
          margin-left: 1rem;
        }
      }
    `};
`

const HeaderCenteredCell = styled(TableHeaderColumn)`
  text-align: center;
`

export const CampaignCodeTable: React.FC<{ filter: CampaignFilter }> = ({
  filter,
}) => {
  const [partnerCampaigns, { loading }] = usePartnerCampaigns(filter)
  const codeTypeOptions = getCodeTypeOptions()
  const [setCodeType, { loading: loadingSetCodeType }] =
    useSetCampaignCodeTypeMutation()
  const [campaignOwnerOptions] = usePartnerCampaignOwners()
  const [setOwner, { loading: loadingSetOwner }] = useSetCampaignOwnerMutation()

  useTitle('Tools | Campaign Codes')

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
        <TableBody>
          {partnerCampaigns.map((campaign) => {
            const { id, campaignCode, incentive, partnerId, codeType } =
              campaign

            return (
              <TableRow key={id} border>
                <CenteredCell editable={true}>
                  {getValidity(campaign)}
                  <PencilFill className="edit-icon" />
                </CenteredCell>
                <CenteredCell>{campaignCode}</CenteredCell>
                <CenteredCell style={{ width: '270px' }}>
                  <SearchableDropdown
                    value={
                      partnerId
                        ? mapCampaignOwners(campaignOwnerOptions).find(
                            (c) => c.value === partnerId,
                          ) ?? null
                        : null
                    }
                    placeholder="No owner"
                    isLoading={loadingSetOwner}
                    onChange={(data) =>
                      data?.value &&
                      toast.promise(
                        setOwner({
                          variables: { id, partnerId: data.value as string },
                          optimisticResponse: {
                            setCampaignOwner: {
                              __typename: 'VoucherCampaign',
                              ...campaign,
                            },
                          },
                        }),
                        {
                          loading: 'Updating campaign owner',
                          success: 'Campaign owner updated',
                          error: 'Could not update campaign owner',
                        },
                      )
                    }
                    noOptionsMessage={() => 'Option not found'}
                    options={mapCampaignOwners(campaignOwnerOptions)}
                  />
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
                        ? codeTypeOptions.find((c) => c.value === codeType) ??
                          null
                        : null
                    }
                    placeholder="No channel"
                    isLoading={loadingSetCodeType}
                    onChange={(data) =>
                      data?.value &&
                      toast.promise(
                        setCodeType({
                          variables: { id, codeType: data.value as string },
                          optimisticResponse: {
                            setCampaignCodeType: {
                              __typename: 'VoucherCampaign',
                              codeType: data.value as string,
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
        </TableBody>
      </Table>
    </Card>
  )
}
