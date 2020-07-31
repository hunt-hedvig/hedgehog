import {
  InfoContainer,
  InfoRow,
} from 'components/member/tabs/shared/card-components'
import {
  CampaignFilter,
  PartnerIdOptions,
} from 'features/tools/campaign-codes/index'
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

  const partnerIdOptions: PartnerIdOptions[] = partnerCampaignOwners.map(
    (partnerCampaignOwner) => ({
      key: partnerCampaignOwner.partnerId,
      value: partnerCampaignOwner.partnerId,
      text: partnerCampaignOwner.partnerId,
    }),
  )

  return (
    <InfoContainer>
      <InfoRow>
        <ThirdLevelHeadline>Filter codes</ThirdLevelHeadline>
      </InfoRow>
      <Spacing top={'small'} />
      <InfoRow>
        <Input
          value={filter.code}
          style={{ width: '100%' }}
          onChange={(e) => {
            setFilter({
              ...filter,
              code: e.currentTarget.value,
            })
          }}
          placeholder="Code"
        />
      </InfoRow>
      <Spacing top={'small'} />
      <InfoRow>
        <Dropdown
          style={{ width: '100%' }}
          placeholder="Campaign owner"
          fluid
          search
          selection
          options={partnerIdOptions}
          value={filter.partnerId as string}
          onChange={(_, data) => {
            setFilter({
              ...filter,
              partnerId: data.value as string,
            })
          }}
        />
      </InfoRow>
      <Spacing top={'small'} />
      <InfoRow>
        <div style={{ float: 'left' }}>
          <DateTimePicker
            fullWidth
            date={filter.activeFrom!!}
            placeholder={'Active from'}
            setDate={(data) => {
              setFilter({
                ...filter,
                activeFrom: data,
              })
            }}
          />
        </div>
        <div style={{ float: 'right' }}>
          <DateTimePicker
            fullWidth
            placeholder={'Active to'}
            date={filter.activeTo!}
            setDate={(data) => {
              setFilter({
                ...filter,
                activeTo: data,
              })
            }}
          />
        </div>
        <Button
          variation="primary"
          onClick={() => {
            setFilter({
              ...filter,
              code: '',
              partnerId: null,
              activeFrom: null,
              activeTo: null,
            })
          }}
        >
          Clear
        </Button>
      </InfoRow>
    </InfoContainer>
  )
}
