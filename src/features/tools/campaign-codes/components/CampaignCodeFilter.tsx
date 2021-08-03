import { CampaignFilter } from 'api/generated/graphql'
import { PartnerDropdown } from 'features/tools/campaign-codes/forms/PartnerDropdown'
import { initialCampaignFilter } from 'features/tools/campaign-codes/utils'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { InfoContainer } from 'hedvig-ui/info-row'
import { Input } from 'hedvig-ui/input'
import { Spacing } from 'hedvig-ui/spacing'
import { Label, ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'

export const CampaignCodeFilter: React.FC<{
  filter: CampaignFilter
  setFilter: React.Dispatch<React.SetStateAction<CampaignFilter>>
}> = ({ filter, setFilter }) => {
  return (
    <InfoContainer>
      <ThirdLevelHeadline>Filter Codes</ThirdLevelHeadline>
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
      <PartnerDropdown
        onChange={(data) =>
          setFilter({
            ...filter,
            partnerId: data ? (data.value as string) : null,
          })
        }
        value={filter.partnerId ?? ''}
        placeholder={'Partner name'}
      />
      <Spacing top={'small'} />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '100%', paddingRight: '1.0em' }}>
          <Label>Valid from</Label>
          <DateTimePicker
            fullWidth={true}
            date={filter.activeFrom}
            setDate={(activeFrom) =>
              setFilter({
                ...filter,
                activeFrom,
              })
            }
          />
        </div>
        <div style={{ width: '100%', paddingLeft: '1.0em' }}>
          <Label>Valid to</Label>
          <DateTimePicker
            fullWidth={true}
            date={filter.activeTo}
            setDate={(activeTo) =>
              setFilter({
                ...filter,
                activeTo,
              })
            }
          />
        </div>
      </div>
      <Spacing top={'small'} />
      <div>
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
