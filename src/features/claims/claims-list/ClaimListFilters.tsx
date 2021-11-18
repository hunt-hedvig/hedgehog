import styled from '@emotion/styled'
import {
  Checkbox,
  Flex,
  Label,
  lightTheme,
  Popover,
  TextDatePicker,
} from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import { Market, MarketFlags } from 'features/config/constants'
import { MemberGroupColorBadge } from 'features/questions/MemberGroupColorBadge'
import { NumberMemberGroupsRadioButtons } from 'features/questions/number-member-groups-radio-buttons'
import { useMe } from 'features/user/hooks/use-me'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import React, { useEffect } from 'react'
import { InfoCircle } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import {
  ClaimComplexity,
  ClaimState,
  UserSettingKey,
} from 'types/generated/graphql'

const FilterWrapper = styled.div`
  width: 100%;
  max-width: 1500px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 2rem 0;
`

const FilterElement = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;

  & label {
    margin: 0;
  }
`

const StyledLabel = styled(Label)`
  display: flex;
  align-items: center;

  & span {
    margin-right: 1em;
  }

  & svg {
    width: 15px;
    height: 15px;

    &:hover {
      cursor: help;
    }
  }
`

const complexityIcons = {
  Simple: '📱',
  Complex: '🌊',
}

const stateColors = {
  Open: lightTheme.accent,
  Closed: lightTheme.activeInsuranceBackground,
  Reopened: lightTheme.accentLight,
}

const LabelWithPopover: React.FC<{ label: string; popover: string }> = ({
  label,
  popover,
}) => (
  <StyledLabel>
    <span>{label}</span>
    <Popover style={{ width: 250 }} contents={popover}>
      <InfoCircle />
    </Popover>
  </StyledLabel>
)

export enum FilterGroupState {
  First,
  Second,
  Third,
}

interface FiltersProps {
  date: string | null
  setDate: (date: string) => void
  page?: string
}

export const ClaimListFilters: React.FC<FiltersProps> = ({
  date,
  setDate,
  page,
}) => {
  const history = useHistory()
  const { settings, updateSetting } = useMe()
  const { numberMemberGroups } = useNumberMemberGroups()

  const settingExist = (field: UserSettingKey, value) =>
    !!settings[field] && !!settings[field].claims
      ? settings[field].claims.includes(value)
      : false

  const setEmptyFilter = (field) => {
    if (!settings[field].claims) {
      updateSetting(field, {
        ...settings[field],
        claims: [],
      })
    }
  }

  useEffect(() => {
    setEmptyFilter(UserSettingKey.ClaimStatesFilter)
    setEmptyFilter(UserSettingKey.MemberGroupsFilter)
    setEmptyFilter(UserSettingKey.ClaimComplexityFilter)
    setEmptyFilter(UserSettingKey.MarketFilter)
  }, [])

  const updateFilterHandler = (
    field: UserSettingKey,
    value: string | number,
  ) => {
    if (!settings[field].claims) {
      updateSetting(field, {
        ...settings[field],
        claims: [value],
      })

      return
    }

    updateSetting(field, {
      ...settings[field],
      claims: settings[field].claims.includes(value)
        ? settings[field].claims.filter(
            (currentValue) => currentValue !== value,
          )
        : [...settings[field].claims, value],
    })

    if (page && page !== '1') {
      history.push(`/claims/list/1`)
    }
  }

  const setDateHandler = (newDate: Date | null) => {
    if (!newDate) {
      return
    }

    const dateString = new Date(newDate.setHours(newDate.getHours() + 2))
      .toISOString()
      .split('T')[0]

    setDate(dateString)
  }

  return (
    <FilterWrapper>
      <FilterElement>
        <Label>States</Label>
        {Object.keys(ClaimState).map((key) => (
          <Flex key={key} direction="row" align="center">
            <Checkbox
              label={key}
              checked={settingExist(
                UserSettingKey.ClaimStatesFilter,
                ClaimState[key],
              )}
              onChange={() => {
                updateFilterHandler(
                  UserSettingKey.ClaimStatesFilter,
                  ClaimState[key],
                )
              }}
            />
            <MemberGroupColorBadge
              style={{
                height: '0.7em',
                width: '0.7em',
                backgroundColor: stateColors[key],
              }}
            />
          </Flex>
        ))}
      </FilterElement>

      <FilterElement>
        <LabelWithPopover
          label="Complexities"
          popover="A complex claim either has a reserve over 50k or is of type Water, Fire, Liability, Legal Protection or Flooding."
        />
        {Object.keys(ClaimComplexity).map((key) => (
          <Flex key={key} direction="row" align="center">
            <Checkbox
              label={key}
              checked={settingExist(
                UserSettingKey.ClaimComplexityFilter,
                ClaimComplexity[key],
              )}
              onChange={() => {
                updateFilterHandler(
                  UserSettingKey.ClaimComplexityFilter,
                  ClaimComplexity[key],
                )
              }}
            />
            <span style={{ marginLeft: '0.5rem' }}>{complexityIcons[key]}</span>
          </Flex>
        ))}
      </FilterElement>

      <FilterElement>
        <Label>Number of member groups</Label>
        <div style={{ display: 'flex' }}>
          <NumberMemberGroupsRadioButtons />
        </div>
      </FilterElement>

      <FilterElement>
        <Label>Groups</Label>
        {range(numberMemberGroups).map((filterNumber) => (
          <Flex key={filterNumber} direction="row" align="center">
            <Checkbox
              label={FilterGroupState[filterNumber]}
              checked={settingExist(
                UserSettingKey.MemberGroupsFilter,
                filterNumber,
              )}
              onChange={() => {
                updateFilterHandler(
                  UserSettingKey.MemberGroupsFilter,
                  filterNumber,
                )
              }}
            />
            <MemberGroupColorBadge
              filter={filterNumber}
              style={{ height: '0.7em', width: '0.7em' }}
            />
          </Flex>
        ))}
      </FilterElement>

      <FilterElement>
        <Label>Markets</Label>
        {Object.keys(Market).map((key) => (
          <Flex key={key} direction="row" align="center">
            <Checkbox
              label={key}
              checked={settingExist(UserSettingKey.MarketFilter, Market[key])}
              onChange={() => {
                updateFilterHandler(UserSettingKey.MarketFilter, Market[key])
              }}
            />
            <span style={{ marginLeft: '0.5rem' }}>
              {MarketFlags[key.toUpperCase()]}
            </span>
          </Flex>
        ))}
      </FilterElement>

      <FilterElement>
        <LabelWithPopover
          label="Date up until"
          popover="The claim was registered either before or on this date."
        />
        <TextDatePicker
          value={date ? new Date(date) : new Date()}
          onChange={setDateHandler}
        />
      </FilterElement>
    </FilterWrapper>
  )
}
