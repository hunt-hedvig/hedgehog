import { Scalars } from 'api/generated/graphql'
import { InfoContainer } from 'components/member/tabs/shared/card-components'
import { format, parseISO } from 'date-fns'
import { CampaignCodeFilter } from 'features/tools/campaign-codes/CampaignCodeFilter'
import { CreateCampaignCode } from 'features/tools/campaign-codes/CreateCampaignCode'
import { usePartnerCampaigns } from 'graphql/use-partner-campaigns'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { MainHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import { Table } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import {
  isCostDeduction,
  isFreeMonths,
  isMonthlyPercentageDiscountFixedPeriod,
} from 'utils/campaignCodes'
import { formatMoney } from 'utils/money'
import { withShowNotification } from 'utils/notifications'
import { CreateNewCampaignCode } from './create-new-campaign-code'

export interface CampaignFilter {
  code: string | null
  partnerId: string | null
  activeFrom: Date | null
  activeTo: Date | null
}

export interface PartnerIdOptions {
  key: string
  value: string
  text: string
}

const CampaignCodeInfoComponent: React.FC<{} & WithShowNotification> = ({
  showNotification,
}) => {
  const [campaignFilter, setCampaignFilter] = React.useState<CampaignFilter>({
    code: null,
    partnerId: null,
    activeFrom: null,
    activeTo: null,
  })

  const getCampaignQueryData = (formState: CampaignFilter) => {
    return {
      code: formState.code,
      partnerId: formState.partnerId,
      activeFrom: formState.activeFrom
        ? format(formState.activeFrom!!, 'yyyy-MM-dd')
        : null,
      activeTo: formState.activeTo
        ? format(formState.activeTo!!, 'yyyy-MM-dd')
        : null,
    }
  }

  const [partnerCampaigns, { refetch }] = usePartnerCampaigns(
    getCampaignQueryData(campaignFilter),
  )

  React.useEffect(() => {
    refetch()
  }, [
    getCampaignQueryData(campaignFilter).partnerId,
    getCampaignQueryData(campaignFilter).code,
    getCampaignQueryData(campaignFilter).activeFrom,
    getCampaignQueryData(campaignFilter).activeTo,
  ])

  const formatDate = (dateToFormat: Scalars['Instant']) => {
    const parsedDate = parseISO(dateToFormat)
    return format(parsedDate, 'yyyy-MM-dd')
  }

  return (
    <>
      <MainHeadline>Campaign Codes</MainHeadline>
      <CardsWrapper>
        <Card span={2}>
          <CampaignCodeFilter
            filter={campaignFilter}
            setFilter={setCampaignFilter}
          />
        </Card>
        <Card span={2}>
          <CreateCampaignCode />
        </Card>
        <Card span={1}>
          <InfoContainer>
            <CreateNewCampaignCode
              partnerIdOptions={[]}
              showNotification={showNotification}
            />
          </InfoContainer>
        </Card>
      </CardsWrapper>
      {partnerCampaigns.length === 0 && 'No partner campaigns :('}
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Valid From</Table.HeaderCell>
            <Table.HeaderCell>Valid To</Table.HeaderCell>
            <Table.HeaderCell>Campaign Code</Table.HeaderCell>
            <Table.HeaderCell>Incentive</Table.HeaderCell>
            <Table.HeaderCell>Campaign Owner</Table.HeaderCell>
            <Table.HeaderCell>Campaign Owner Name</Table.HeaderCell>
            <Table.HeaderCell>Percentage Discount %</Table.HeaderCell>
            <Table.HeaderCell>Number of Months</Table.HeaderCell>
            <Table.HeaderCell>Discounted Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <>
            {partnerCampaigns.map((campaign) => (
              <Table.Row key={campaign.id}>
                <Table.Cell>
                  {campaign.validFrom ? formatDate(campaign.validFrom) : '-'}
                </Table.Cell>
                <Table.Cell>
                  {campaign.validTo ? formatDate(campaign.validTo) : '-'}
                </Table.Cell>
                <Table.Cell>{campaign.campaignCode}</Table.Cell>
                <Table.Cell>{campaign.incentive?.__typename}</Table.Cell>
                <Table.Cell>{campaign.partnerId}</Table.Cell>
                <Table.Cell>{campaign.partnerName}</Table.Cell>
                <Table.Cell>
                  {isMonthlyPercentageDiscountFixedPeriod(campaign.incentive) &&
                  campaign.incentive.percentage
                    ? campaign.incentive.percentage
                    : '-'}
                </Table.Cell>
                <Table.Cell>
                  {!isFreeMonths(campaign.incentive) &&
                    !isMonthlyPercentageDiscountFixedPeriod(
                      campaign.incentive,
                    ) &&
                    '-'}
                  {((isMonthlyPercentageDiscountFixedPeriod(
                    campaign.incentive,
                  ) ||
                    isFreeMonths(campaign.incentive)) &&
                    campaign.incentive.numberOfMonths) ??
                    '-'}
                </Table.Cell>
                <Table.Cell>
                  {!isCostDeduction(campaign.incentive) && '-'}
                  {(isCostDeduction(campaign.incentive) &&
                    campaign.incentive.amount &&
                    formatMoney(campaign.incentive.amount)) ??
                    '-'}
                </Table.Cell>
              </Table.Row>
            ))}
          </>
        </Table.Body>
      </Table>
    </>
  )
}

export const CampaignCodeInfo = withShowNotification(CampaignCodeInfoComponent)
