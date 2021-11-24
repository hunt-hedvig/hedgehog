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
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React from 'react'
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

interface FiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  templated?: boolean
  templatedId?: number
  filters?: ClaimsFiltersType
  setFilters?: (newFilter: ClaimsFiltersType, id?: number) => void
  date?: string | null
  setDate?: (date: string) => void
  page?: string
  withDate?: boolean
}

export const ClaimListFilters: React.FC<FiltersProps> = ({
  templated,
  filters,
  setFilters,
  date,
  setDate,
  page,
  withDate = true,
  templatedId,
  ...props
}) => {
  const history = useHistory()
  const { settings, updateSetting } = useMe()
  const { numberMemberGroups } = useNumberMemberGroups()

  const isFilterExist = (state, field) =>
    filters &&
    filters[field] &&
    !!filters[field].filter((st) => st === state).length

  const settingExist = (field: UserSettingKey, value) => {
    if (!settings[field]) {
      return false
    }
    return !!settings[field].claims
      ? settings[field].claims.includes(value)
      : false
  }

  const setFilterHandler = (state: string | number, field) => {
    if (setFilters && typeof templatedId === 'number' && filters) {
      if (isFilterExist(state, field)) {
        setFilters(
          {
            ...filters,
            [field]: filters[field].filter((st) => st !== state),
          },
          templatedId,
        )

        if (page && page !== '1') {
          history.push(`/claims/list/1`)
        }

        return
      }

      setFilters(
        {
          ...filters,
          [field]: filters[field] ? [...filters[field], state] : [state],
        },
        templatedId,
      )
    }

    if (page && page !== '1') {
      history.push(`/claims/list/1`)
    }
  }

  const updateFilterHandler = (
    field: UserSettingKey,
    value: string | number,
  ) => {
    if (!settings[field] || !settings[field].claims) {
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

    if (setDate) {
      setDate(dateString)
    }
  }

  return (
    <FilterWrapper {...props}>
      <FilterElement>
        <Label>States</Label>
        {Object.keys(ClaimState).map((key) => (
          <Flex key={key} direction="row" align="center">
            <Checkbox
              label={key}
              checked={
                !templated
                  ? settingExist(
                      UserSettingKey.ClaimStatesFilter,
                      ClaimState[key],
                    )
                  : isFilterExist(ClaimState[key], 'filterClaimStates') || false
              }
              onChange={() => {
                !templated
                  ? updateFilterHandler(
                      UserSettingKey.ClaimStatesFilter,
                      ClaimState[key],
                    )
                  : setFilterHandler(ClaimState[key], 'filterClaimStates')
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
              checked={
                !templated
                  ? settingExist(
                      UserSettingKey.ClaimComplexityFilter,
                      ClaimComplexity[key],
                    )
                  : isFilterExist(ClaimComplexity[key], 'filterComplexities') ||
                    false
              }
              onChange={() => {
                !templated
                  ? updateFilterHandler(
                      UserSettingKey.ClaimComplexityFilter,
                      ClaimComplexity[key],
                    )
                  : setFilterHandler(ClaimComplexity[key], 'filterComplexities')
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
              checked={
                !templated
                  ? settingExist(
                      UserSettingKey.MemberGroupsFilter,
                      filterNumber,
                    )
                  : isFilterExist(filterNumber, 'filterSelectedMemberGroups') ||
                    false
              }
              onChange={() => {
                !templated
                  ? updateFilterHandler(
                      UserSettingKey.MemberGroupsFilter,
                      filterNumber,
                    )
                  : setFilterHandler(filterNumber, 'filterSelectedMemberGroups')
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
              checked={
                !templated
                  ? settingExist(UserSettingKey.MarketFilter, Market[key])
                  : isFilterExist(Market[key], 'filterMarkets') || false
              }
              onChange={() => {
                !templated
                  ? updateFilterHandler(
                      UserSettingKey.MarketFilter,
                      Market[key],
                    )
                  : setFilterHandler(Market[key], 'filterMarkets')
              }}
            />
            <span style={{ marginLeft: '0.5rem' }}>
              {MarketFlags[key.toUpperCase()]}
            </span>
          </Flex>
        ))}
      </FilterElement>

      {withDate && (
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
      )}
    </FilterWrapper>
  )
}
