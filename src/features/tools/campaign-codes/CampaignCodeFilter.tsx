import { CampaignFilter } from 'api/generated/graphql'
import { InfoContainer } from 'components/member/tabs/shared/card-components'
import {
  initialCampaignFilter,
  mapCampaignOwners,
} from 'features/tools/campaign-codes/utils'
import { usePartnerCampaignOwners } from 'graphql/use-get-partner-campaign-owners'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { Dropdown, Input } from 'semantic-ui-react'

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
        style={{ width: '100%' }}
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
        style={{ width: '100%' }}
        placeholder="Campaign owner"
        fluid
        search
        selection
        options={mapCampaignOwners(partnerCampaignOwners)}
        value={filter.partnerId as string}
        onChange={(_, { value: partnerId }) => {
          setFilter({
            ...filter,
            partnerId: partnerId as string,
          })
        }}
      />
      <Spacing top={'small'} />
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ float: 'left' }}>
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
        </div>
        <div style={{ float: 'right' }}>
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
        </div>
        <Button
          variation="primary"
          onClick={() => {
            setFilter(initialCampaignFilter)
          }}
        >
          Clear
        </Button>
      </div>
    </InfoContainer>
  )
}
