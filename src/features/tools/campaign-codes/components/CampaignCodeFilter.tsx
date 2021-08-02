import { CampaignFilter } from 'api/generated/graphql'
import { ClearableDropdown as Dropdown } from 'features/tools/campaign-codes/components/ClearableDropdown'
import {
  DateTimePickerWrapper,
  Row,
} from 'features/tools/campaign-codes/styles'
import {
  initialCampaignFilter,
  mapCampaignOwners,
} from 'features/tools/campaign-codes/utils'
import { usePartnerCampaignOwners } from 'graphql/use-get-partner-campaign-owners'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { InfoContainer } from 'hedvig-ui/info-row'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { Input } from 'semantic-ui-react'

export const CampaignCodeFilter: React.FC<{
  filter: CampaignFilter
  setFilter: React.Dispatch<React.SetStateAction<CampaignFilter>>
}> = ({ filter, setFilter }) => {
  const [partnerCampaignOwners] = usePartnerCampaignOwners()

  return (
    <InfoContainer>
      <ThirdLevelHeadline>Filter codes</ThirdLevelHeadline>
      <Spacing top={'small'} />
      <Input
        value={filter.code ?? ''}
        onChange={({ currentTarget: { value: code } }) => {
          setFilter({
            ...filter,
            code,
          })
        }}
        placeholder="Code"
      />
      <Spacing top={'small'} />
      <Dropdown
        options={mapCampaignOwners(partnerCampaignOwners)}
        value={filter.partnerId ?? ''}
        placeholder="Partner"
        onChange={(_, { value: partnerId }) => {
          setFilter({
            ...filter,
            partnerId: partnerId as string,
          })
        }}
        onClear={() => {
          setFilter({
            ...filter,
            partnerId: null,
          })
        }}
      />
      <Spacing top={'small'} />
      <Row>
        <DateTimePickerWrapper>
          <DateTimePicker
            fullWidth
            date={filter.activeFrom!!}
            placeholder={'Active from'}
            setDate={(activeFrom) => {
              setFilter({
                ...filter,
                activeFrom,
              })
            }}
          />
          <DateTimePicker
            fullWidth
            placeholder={'Active to'}
            date={filter.activeTo!}
            setDate={(activeTo) => {
              setFilter({
                ...filter,
                activeTo,
              })
            }}
          />
          <Button
            variation="primary"
            onClick={() => {
              setFilter(initialCampaignFilter)
            }}
          >
            Clear
          </Button>
        </DateTimePickerWrapper>
      </Row>
    </InfoContainer>
  )
}
