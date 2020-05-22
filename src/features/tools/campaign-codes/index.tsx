import { format } from 'date-fns'
import { usePartnerCampaigns } from 'graphql/use-partner-campaigns'
import * as React from 'react'
import styled from 'react-emotion'
import { Button, Dropdown, Form, Input, Table } from 'semantic-ui-react'
import { DateTimePicker } from '../../../../shared/hedvig-ui/date-time-picker'
import { Spacing } from '../../../../shared/hedvig-ui/spacing'
import { MainHeadline } from '../../../../shared/hedvig-ui/typography'
import { usePartnerCampaignOwners } from '../../../graphql/use-get-partner-campaign-owners'

export const CampaignCodeInfo: React.FC = () => {
  const [partnerCampaigns, { loading, refetch }] = usePartnerCampaigns()
  const [filter, setFilter] = React.useState(false)
  const [shouldCreate, setShouldCreate] = React.useState(false)

  const ButtonWrapper = styled('div')`
    padding: 10px;
  `

  return (
    <>
      <MainHeadline>Campaign Codes</MainHeadline>
      <ButtonWrapper>
        <Button onClick={() => setFilter(!filter)}>Filter codes</Button>
        <Button onClick={() => setShouldCreate(!shouldCreate)}>
          Create new code
        </Button>
      </ButtonWrapper>
      {filter && <FilterCodes />}
      {shouldCreate && <CreateNewCampaignCode />}
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

interface FilterFormState {
  code: string | null
  campaignOwnerId: string | null
}

export const FilterCodes: React.FC = () => {
  const [
    activeFromDatePickerEnabled,
    setActiveFromDatePickerEnabled,
  ] = React.useState(false)
  const [
    activeToDatePickerEnabled,
    setActiveToDatePickerEnabled,
  ] = React.useState(false)
  const [activeFromFilterDate, setActiveFromFilterDate] = React.useState(
    new Date(),
  )
  const [activeToFilterDate, setActiveToFilterDate] = React.useState(new Date())
  const [isWip, setIsWip] = React.useState(false)
  const [filterFormState, setFilterFormState] = React.useState<FilterFormState>(
    {
      code: null,
      campaignOwnerId: null,
    },
  )

  const getTextInput = (
    variable: keyof FilterFormState,
    inputType = 'text',
  ) => (
    <>
      <Input
        onChange={(e) => {
          if (isWip) {
            setIsWip(true)
          }
          setFilterFormState({
            ...filterFormState,
            [variable]: e.currentTarget.value,
          })
        }}
        type={inputType}
      />
    </>
  )

  return (
    <Form>
      <Form.Field>
        <label>Code</label>
        {getTextInput('code', 'Code')}
      </Form.Field>
      <Form.Field>
        <label>Campaign owner id</label>
        {getTextInput('campaignOwnerId', 'Campaign Owner Id')}
      </Form.Field>
      <Form.Field>
        <label>Campaign code active from</label>
        <input
          onClick={() =>
            setActiveFromDatePickerEnabled(!activeFromDatePickerEnabled)
          }
          placeholder={format(activeFromFilterDate, 'yyyy-MM-dd')}
        />
        {activeFromDatePickerEnabled && (
          <>
            <DateTimePicker
              date={activeFromFilterDate}
              setDate={setActiveFromFilterDate}
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
          placeholder={format(activeToFilterDate, 'yyyy-MM-dd')}
        />
        {activeToDatePickerEnabled && (
          <>
            <DateTimePicker
              date={activeToFilterDate}
              setDate={setActiveToFilterDate}
            />
          </>
        )}
      </Form.Field>
      <Button type="submit">Filter</Button>
    </Form>
  )
}

export const CreateNewCampaignCode: React.FC = () => {
  const [
    partnerCampaignOwners,
    { loading, refetch },
  ] = usePartnerCampaignOwners()

  if (loading) {
    return loading
  }

  const options = partnerCampaignOwners.map((partnerCampaignOwner) => ({
    key: partnerCampaignOwner.partnerId,
    value: partnerCampaignOwner.partnerId,
    text: partnerCampaignOwner.partnerId,
  }))

  return (
    <>
      <Form>
        <Form.Field>
          <label>Code</label>
          <input placeholder="Code" />
        </Form.Field>
        <Form.Field>
          <label>Partner id</label>
          <Dropdown
            placeholder="partnerId"
            fluid
            search
            selection
            options={options}
          />
        </Form.Field>
        <Form.Field>
          <label>Number of months</label>
          <input placeholder="" />
        </Form.Field>
        <Form.Field>
          <label>Percentage discount</label>
          <input placeholder="" />
        </Form.Field>
        <Form.Field>
          <label>Valid from</label>
          <input placeholder="Valid from" />
        </Form.Field>
        <Form.Field>
          <label>Valid to</label>
          <input placeholder="Valid to" />
        </Form.Field>
        <Button type="submit">Create</Button>
      </Form>
    </>
  )
}
