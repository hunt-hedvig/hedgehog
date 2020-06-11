import { Scalars } from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import { usePartnerCampaignOwners } from 'graphql/use-get-partner-campaign-owners'
import { usePartnerCampaigns } from 'graphql/use-partner-campaigns'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { Spacing } from 'hedvig-ui/spacing'
import { MainHeadline } from 'hedvig-ui/typography'
import { formatMoneyNO, formatMoneySE } from 'lib/intl'
import * as React from 'react'
import { Dropdown, Form, Input, Table } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import {
  isCostDeduction,
  isFreeMonths,
  isMonthlyPercentageDiscountFixedPeriod,
} from 'utils/campaignCodes'
import { withShowNotification } from 'utils/notifications'
import { CreateNewCampaignCode } from './create-new-campaign-code'

interface CampaignQueryFormState {
  code: string | null
  partnerId: string | null
  activeFrom: Date | null
  activeTo: Date | null
}

interface PartnerIdOptions {
  key: string
  value: string
  text: string
}

const CampaignCodeInfoComponent: React.FC<{} & WithShowNotification> = ({
  showNotification,
}) => {
  const [filter, setFilter] = React.useState(false)
  const [shouldCreate, setShouldCreate] = React.useState(false)

  const [campaignQueryFormState, setCampaignQueryFormState] = React.useState<
    CampaignQueryFormState
  >({
    code: null,
    partnerId: null,
    activeFrom: null,
    activeTo: null,
  })

  const getCampaignQueryData = (formState: CampaignQueryFormState) => {
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
    getCampaignQueryData(campaignQueryFormState),
  )

  React.useEffect(() => {
    refetch()
  }, [
    getCampaignQueryData(campaignQueryFormState).partnerId,
    getCampaignQueryData(campaignQueryFormState).code,
    getCampaignQueryData(campaignQueryFormState).activeFrom,
    getCampaignQueryData(campaignQueryFormState).activeTo,
  ])

  const [partnerCampaignOwners] = usePartnerCampaignOwners()

  const partnerIdOptions: PartnerIdOptions[] = partnerCampaignOwners.map(
    (partnerCampaignOwner) => ({
      key: partnerCampaignOwner.partnerId,
      value: partnerCampaignOwner.partnerId,
      text: partnerCampaignOwner.partnerId,
    }),
  )
  const [
    activeFromDatePickerEnabled,
    setActiveFromDatePickerEnabled,
  ] = React.useState(false)
  const [
    activeToDatePickerEnabled,
    setActiveToDatePickerEnabled,
  ] = React.useState(false)

  const formatDate = (dateToFormat: Scalars['Instant']) => {
    const parsedDate = parseISO(dateToFormat)
    return format(parsedDate, 'yyyy-MM-dd')
  }

  return (
    <>
      <MainHeadline>Campaign Codes</MainHeadline>
      <Spacing all>
        <ButtonsGroup>
          <Button onClick={() => setFilter(!filter)}>Filter codes</Button>
          <Button onClick={() => setShouldCreate(!shouldCreate)}>
            Create new code
          </Button>
        </ButtonsGroup>
      </Spacing>
      {filter && (
        <Spacing bottom>
          <Form>
            <Form.Field>
              <label>Code</label>
              <Input
                onChange={(e) => {
                  setCampaignQueryFormState({
                    ...campaignQueryFormState,
                    code: e.currentTarget.value,
                  })
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Campaign owner id</label>
              <Dropdown
                placeholder="partnerId"
                fluid
                search
                selection
                options={partnerIdOptions}
                onChange={(_, data) => {
                  setCampaignQueryFormState({
                    ...campaignQueryFormState,
                    partnerId: data.value as string,
                  })
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Campaign code active from</label>
              <input
                onClick={() =>
                  setActiveFromDatePickerEnabled(!activeFromDatePickerEnabled)
                }
                placeholder={
                  campaignQueryFormState.activeFrom
                    ? format(campaignQueryFormState.activeFrom, 'yyyy-MM-dd')
                    : ''
                }
              />
              {activeFromDatePickerEnabled && (
                <>
                  <DateTimePicker
                    date={campaignQueryFormState.activeFrom!!}
                    setDate={(data) => {
                      setCampaignQueryFormState({
                        ...campaignQueryFormState,
                        activeFrom: data,
                      })
                    }}
                  />
                </>
              )}
            </Form.Field>
            <Form.Field>
              <label>Campaign code active to</label>
              <input
                onClick={() =>
                  setActiveToDatePickerEnabled(!activeToDatePickerEnabled)
                }
                placeholder={
                  campaignQueryFormState.activeFrom
                    ? format(campaignQueryFormState.activeFrom, 'yyyy-MM-dd')
                    : ''
                }
              />
              {activeToDatePickerEnabled && (
                <>
                  <DateTimePicker
                    date={campaignQueryFormState.activeTo!}
                    setDate={(data) => {
                      setCampaignQueryFormState({
                        ...campaignQueryFormState,
                        activeTo: data,
                      })
                    }}
                  />
                </>
              )}
            </Form.Field>
          </Form>
        </Spacing>
      )}
      {shouldCreate && (
        <CreateNewCampaignCode
          partnerIdOptions={partnerIdOptions}
          showNotification={showNotification}
        />
      )}
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
                    ? campaign.incentive.percentage / 0.01
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
                    (campaign.incentive.amount.currency === 'NOK'
                      ? formatMoneyNO(campaign.incentive.amount)
                      : formatMoneySE(campaign.incentive.amount))) ??
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
