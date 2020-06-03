import { format } from 'date-fns'
import { usePartnerCampaigns } from 'graphql/use-partner-campaigns'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import * as moment from 'moment'
import * as React from 'react'
import styled from 'react-emotion'
import { Dropdown, Form, Input, Table } from 'semantic-ui-react'
import { withShowNotification } from 'utils/notifications'
import { DateTimePicker } from '../../../../shared/hedvig-ui/date-time-picker'
import { Spacing } from '../../../../shared/hedvig-ui/spacing'
import { MainHeadline } from '../../../../shared/hedvig-ui/typography'
import { usePartnerCampaignOwners } from '../../../graphql/use-get-partner-campaign-owners'
import { WithShowNotification } from '../../../store/actions/notificationsActions'
import {
  isCostDeduction,
  isFreeMonths,
  isMonthlyPercentageDiscountFixedPeriod,
} from '../../../utils/campaignCodes'
import { CreateNewCampaignCode } from './create-new-campaign-code'

interface CampaignQueryFormState {
  code: string | null
  partnerId: string | null
  activeFrom: Date | null
  activeTo: Date | null
}

const CampaignCodeInfoComponent: React.FC<{} & WithShowNotification> = ({
  showNotification,
}) => {
  const [filter, setFilter] = React.useState(false)
  const [shouldCreate, setShouldCreate] = React.useState(false)

  const ButtonWrapper = styled('div')`
    padding: 10px;
  `
  interface PartnerIdOptions {
    key: string
    value: string
    text: string
  }

  interface FilterFormState {
    code: string | null
    campaignOwnerId: string | null
  }

  const [campaignQueryFormState, setCampaignQueryFormState] = React.useState<
    CampaignQueryFormState
  >({
    code: null,
    partnerId: null,
    activeFrom: null,
    activeTo: null,
  })

  const [
    partnerCampaigns,
    { loading: partnerCampaignsLoading, refetch },
  ] = usePartnerCampaigns(campaignQueryFormState)

  console.log(campaignQueryFormState, campaignQueryFormState.partnerId)

  // React.useEffect(() => {
  //   refetch().then((r) => console.log('refetched'))
  // }, [campaignQueryFormState.partnerId])

  const [
    partnerCampaignOwners,
    { loading: partnerCampaignOwnersLoading },
  ] = usePartnerCampaignOwners()

  const partnerIdOptions: PartnerIdOptions[] = partnerCampaignOwners.map(
    (partnerCampaignOwner) => ({
      key: partnerCampaignOwner.partnerId,
      value: partnerCampaignOwner.partnerId,
      text: partnerCampaignOwner.partnerId,
    }),
  )

  console.log(campaignQueryFormState)

  const [
    activeFromDatePickerEnabled,
    setActiveFromDatePickerEnabled,
  ] = React.useState(false)
  const [
    activeToDatePickerEnabled,
    setActiveToDatePickerEnabled,
  ] = React.useState(false)

  const getTextInput = (
    variable: keyof FilterFormState,
    inputType = 'text',
  ) => (
    <>
      <Input
        onChange={(e) => {
          setCampaignQueryFormState({
            ...campaignQueryFormState,
            [variable]: e.currentTarget.value,
          })
        }}
        value={campaignQueryFormState[variable]}
        type={inputType}
      />
    </>
  )

  const formatDate = (dateToFormat: any) => {
    const date = moment(dateToFormat).local()
    return date.isValid() ? date.format('DD MMMM YYYY') : '-'
  }

  return (
    <>
      <MainHeadline>Campaign Codes</MainHeadline>
      <ButtonWrapper>
        <ButtonsGroup>
          <Button onClick={() => setFilter(!filter)}>Filter codes</Button>
          <Button onClick={() => setShouldCreate(!shouldCreate)}>
            Create new code
          </Button>
        </ButtonsGroup>
      </ButtonWrapper>
      {filter && (
        <Form>
          <Form.Field>
            <label>Code</label>
            {getTextInput('code', 'Code')}
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
      )}
      {shouldCreate && (
        <CreateNewCampaignCode
          partnerIdOptions={partnerIdOptions}
          showNotification={showNotification}
        />
      )}
      <Spacing>
        {partnerCampaignsLoading && 'loading...'}
        {!partnerCampaignsLoading &&
          partnerCampaigns.length === 0 &&
          'No partner campaigns :('}
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
                    {isMonthlyPercentageDiscountFixedPeriod(
                      campaign.incentive,
                    ) && campaign.incentive.percentage
                      ? campaign.incentive.percentage / 0.01
                      : '-'}
                  </Table.Cell>
                  <Table.Cell>
                    {(isFreeMonths(campaign.incentive) &&
                      campaign.incentive.numberOfMonths) ??
                      '-'}
                  </Table.Cell>
                  <Table.Cell>
                    {(isCostDeduction(campaign.incentive) &&
                      campaign.incentive.amount) ??
                      '-'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </>
          </Table.Body>
        </Table>
      </Spacing>
    </>
  )
}

export const CampaignCodeInfo = withShowNotification(CampaignCodeInfoComponent)
