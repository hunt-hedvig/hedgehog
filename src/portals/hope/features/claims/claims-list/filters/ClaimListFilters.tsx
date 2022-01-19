import styled from '@emotion/styled'
import { MemberGroupColorBadge } from 'portals/hope/features/questions/MemberGroupColorBadge'
import React, { useState } from 'react'

import { range } from '@hedvig-ui/utils/range'
import { InfoCircle } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import {
  ClaimComplexity,
  ClaimState,
  UserSettingKey,
} from 'types/generated/graphql'
import {
  Checkbox,
  Flex,
  Label,
  lightTheme,
  MultiDropdown,
  Popover,
  Radio,
  TextDatePicker,
} from '@hedvig-ui'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { numberMemberGroupsOptions } from 'portals/hope/features/questions/number-member-groups-radio-buttons'
import { Market, MarketFlags } from 'portals/hope/features/config/constants'
import { ClaimOutcomes } from '../../claim-details/ClaimInformation/components/ClaimOutcomeDropdown/ClaimOutcomeDropdown'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'

export const FilterWrapper = styled.div`
  width: 100%;
  max-width: 1500px;

  display: grid;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 3rem;
  align-items: flex-start;
  margin: 2rem 0;
`

export const FilterElement = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;

  & label {
    margin: 0;
  }
`

export const StyledLabel = styled(Label)`
  width: 100%;

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

const OutcomeFilter: React.FC<{
  outcomes: ClaimOutcomes[]
  onSelect: (value: string | null) => void
  open: boolean
  multi: boolean
}> = ({ outcomes, onSelect, open }) => {
  const options = [
    ...Object.keys(ClaimOutcomes).map((value) => ({
      value,
      text: convertEnumToTitle(value),
    })),
    { value: 'not_specified', text: 'Not specified' },
  ]

  return (
    <MultiDropdown
      value={outcomes?.map((item) => convertEnumToTitle(item)) || null}
      open={open}
      options={options.map((opt) => opt.text)}
      placeholder="Outcome filter"
      onChange={(value) => {
        const selectedValue = options.filter((opt) => opt.text === value)[0]
        onSelect(selectedValue.value)
      }}
      clearHandler={() => onSelect(null)}
      style={{ minWidth: '10rem' }}
    />
  )
}

export const complexityIcons = {
  Simple: '📱',
  Complex: '🌊',
}

export const stateColors = {
  Open: lightTheme.accent,
  Closed: lightTheme.activeInsuranceBackground,
  Reopened: lightTheme.accentLight,
}

export const LabelWithPopover: React.FC<{ label: string; popover: string }> = ({
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

interface ClaimListFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  date: string | null
  setDate: (date: string | null) => void
  page?: string
}

export const ClaimListFilters: React.FC<ClaimListFiltersProps> = ({
  date,
  setDate,
  page,
}) => {
  const history = useHistory()
  const { settings, updateSetting } = useMe()
  const { numberMemberGroups, setNumberMemberGroups } = useNumberMemberGroups()
  const [outcomeOpen, setOutcomeOpen] = useState(false)

  const settingExist = (field: UserSettingKey, value) => {
    if (!settings[field]) {
      return false
    }
    return settings[field].claims
      ? settings[field].claims.includes(value)
      : false
  }

  const updateFilterHandler = (
    field: UserSettingKey,
    value: string | number,
  ) => {
    if (page && page !== '1') {
      history.push(`/claims/list/1`)
    }

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
  }

  const updateOutcomeFilterHandler = (value: string | null) => {
    const field = UserSettingKey.OutcomeFilter

    if (!settings[field] || !settings[field].claims) {
      updateSetting(field, {
        ...settings[field],
        claims: value ? [value] : [],
      })

      return
    }

    updateSetting(field, {
      ...settings[field],
      claims: !value
        ? []
        : settings[field].claims.includes(value)
        ? settings[field].claims.filter(
            (currentValue) => currentValue !== value,
          )
        : [...settings[field].claims, value],
    })
  }

  const updateNumberMemberSetting = (state: number) => {
    if (
      state === 2 &&
      settings[UserSettingKey.MemberGroupsFilter].claims.includes(2)
    ) {
      updateSetting(UserSettingKey.MemberGroupsFilter, {
        ...settings[UserSettingKey.MemberGroupsFilter],
        claims: settings[UserSettingKey.MemberGroupsFilter].claims.filter(
          (memberGroup) => memberGroup !== 2,
        ),
      })
    }
  }

  const { register } = useNavigation()

  return (
    <FilterWrapper>
      <FilterElement>
        <Label>States</Label>
        {Object.keys(ClaimState).map((key, index) => {
          const states = Object.keys(ClaimState)
          const navigation = register(key, {
            focus: index === 0 ? Keys.F : undefined,
            resolve: () => {
              updateFilterHandler(
                UserSettingKey.ClaimStatesFilter,
                ClaimState[key],
              )
            },
            neighbors: {
              up: index ? states[index - 1] : undefined,
              down: index < states.length - 1 ? states[index + 1] : undefined,
              right: Object.keys(ClaimComplexity)[0],
            },
          })

          return (
            <Flex key={key} direction="row" align="center" {...navigation}>
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
          )
        })}
      </FilterElement>

      <FilterElement>
        <LabelWithPopover
          label="Complexities"
          popover="A complex claim either has a reserve over 50k or is of type Water, Fire, Liability, Legal Protection or Flooding."
        />
        {Object.keys(ClaimComplexity).map((key, index) => {
          const complexities = Object.keys(ClaimComplexity)
          const navigation = register(key, {
            resolve: () => {
              updateFilterHandler(
                UserSettingKey.ClaimComplexityFilter,
                ClaimComplexity[key],
              )
            },
            neighbors: {
              left: Object.keys(ClaimState)[0],
              up: index ? complexities[index - 1] : undefined,
              down:
                index < complexities.length - 1
                  ? complexities[index + 1]
                  : undefined,
              right: `Member Groups ${numberMemberGroupsOptions[0].label}`,
            },
          })

          return (
            <Flex key={key} direction="row" align="center" {...navigation}>
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
              <span style={{ marginLeft: '0.5rem' }}>
                {complexityIcons[key]}
              </span>
            </Flex>
          )
        })}
      </FilterElement>

      <FilterElement>
        <Label>Number of member groups</Label>
        {numberMemberGroupsOptions.map((option, index) => {
          const navigation = register(`Member Groups ${option.label}`, {
            resolve: () => {
              updateNumberMemberSetting(option.value)
              updateSetting(UserSettingKey.NumberOfMemberGroups, {
                value: option.value,
              })
              setNumberMemberGroups(option.value)
            },
            neighbors: {
              left: Object.keys(ClaimComplexity)[0],
              up: index
                ? `Member Groups ${numberMemberGroupsOptions[index - 1].label}`
                : undefined,
              down:
                index < numberMemberGroupsOptions.length - 1
                  ? `Member Groups ${
                      numberMemberGroupsOptions[index + 1].label
                    }`
                  : undefined,
              right: `Member Number ${range(numberMemberGroups)[0]}`,
            },
          })

          return (
            <Flex key={index} direction="row" align="center" {...navigation}>
              <Radio
                key={`${option.value}` + index}
                id={`${option.value}` + index}
                value={option.value}
                label={option.label}
                onChange={() => {
                  updateNumberMemberSetting(option.value)
                  updateSetting(UserSettingKey.NumberOfMemberGroups, {
                    value: option.value,
                  })
                  setNumberMemberGroups(option.value)
                }}
                checked={option.value === numberMemberGroups || false}
              />
            </Flex>
          )
        })}
      </FilterElement>

      <FilterElement>
        <Label>Groups</Label>
        {range(numberMemberGroups).map((filterNumber, index) => {
          const navigation = register(`Member Number ${filterNumber}`, {
            resolve: () => {
              updateFilterHandler(
                UserSettingKey.MemberGroupsFilter,
                filterNumber,
              )
            },
            neighbors: {
              left: `Member Groups ${numberMemberGroupsOptions[0].label}`,
              up: index
                ? `Member Number ${range(numberMemberGroups)[index - 1]}`
                : undefined,
              down:
                index < range(numberMemberGroups).length - 1
                  ? `Member Number ${range(numberMemberGroups)[index + 1]}`
                  : undefined,
              right: Object.keys(Market)[0],
            },
          })

          return (
            <Flex
              key={filterNumber}
              direction="row"
              align="center"
              {...navigation}
            >
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
          )
        })}
      </FilterElement>

      <FilterElement>
        <Label>Markets</Label>
        {Object.keys(Market).map((key, index) => {
          const markets = Object.keys(Market)
          const navigation = register(key, {
            resolve: () => {
              updateFilterHandler(UserSettingKey.MarketFilter, Market[key])
            },
            neighbors: {
              left: `Member Number ${range(numberMemberGroups)[0]}`,
              up: index ? markets[index - 1] : undefined,
              down: index < markets.length - 1 ? markets[index + 1] : undefined,
              right: `Outcome Filter`,
            },
          })

          return (
            <Flex key={key} direction="row" align="center" {...navigation}>
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
          )
        })}
      </FilterElement>

      <FilterElement>
        <Label>Outcome</Label>
        <OutcomeFilter
          {...register('Outcome Filter', {
            resolve: () => {
              setOutcomeOpen((prev) => !prev)
              return convertEnumToTitle(Object.keys(ClaimOutcomes)[0])
            },
            neighbors: {
              left: Object.keys(Market)[0],
              right: 'Date Filter',
            },
          })}
          open={outcomeOpen}
          multi
          onSelect={updateOutcomeFilterHandler}
          outcomes={
            (settings[UserSettingKey.OutcomeFilter] &&
              settings[UserSettingKey.OutcomeFilter].claims) ||
            null
          }
        />
      </FilterElement>

      <FilterElement>
        <LabelWithPopover
          label="Date up until"
          popover="The claim was registered either before or on this date."
        />
        <TextDatePicker
          value={date}
          onChange={setDate}
          {...register('Date Filter', {
            neighbors: {
              left: 'Outcome Filter',
            },
          })}
        />
      </FilterElement>
    </FilterWrapper>
  )
}
