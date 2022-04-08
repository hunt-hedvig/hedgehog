import styled from '@emotion/styled'
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
import { Keys } from '@hedvig-ui'
import { useNavigation } from '@hedvig-ui'
import { range } from '@hedvig-ui'
import { convertEnumOrSentenceToTitle, convertEnumToTitle } from '@hedvig-ui'
import { ClaimOutcomes } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ClaimOutcomeDropdown'
import {
  Market,
  MarketFlags,
  MemberGroups,
} from 'portals/hope/features/config/constants'
import { MemberGroupColorBadge } from 'portals/hope/features/questions/MemberGroupColorBadge'
import { numberMemberGroupsOptions } from 'portals/hope/features/questions/number-member-groups-radio-buttons'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import React, { useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import {
  ClaimComplexity,
  ClaimState,
  UserSettings,
} from 'types/generated/graphql'

export const FilterWrapper = styled.div`
  width: 100%;
  max-width: 1500px;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
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

interface OutcomeFilterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onChange'> {
  outcomes?: string[] | null
  onSelect: (value: string | null) => void
  open: boolean
  multi: boolean
}

const OutcomeFilter: React.FC<OutcomeFilterProps> = ({
  outcomes,
  onSelect,
  open,
  ...props
}) => {
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
      style={{ minWidth: '10rem', ...props.style }}
      {...props}
    />
  )
}

export const complexityIcons: Record<ClaimComplexity, string> = {
  SIMPLE: '📱',
  COMPLEX: '🌊',
}

export const stateColors: Record<ClaimState, string> = {
  OPEN: lightTheme.accent,
  CLOSED: lightTheme.activeInsuranceBackground,
  REOPENED: lightTheme.accentLight,
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

  const updateFilterHandler = (field: keyof UserSettings, value: string) => {
    if (page && page !== '1') {
      history.push(`/claims/list/1`)
    }

    const newSettingValue = settings[field] as string[]

    if (!newSettingValue) {
      updateSetting(field, [value])

      return
    }

    if (newSettingValue.includes(value as string)) {
      updateSetting(
        field,
        newSettingValue?.filter(
          (currentValue: string) => currentValue !== value,
        ),
      )
    } else {
      updateSetting(field, [...newSettingValue, value])
    }
  }

  const updateFilterNumberHandler = (
    field: keyof UserSettings,
    value: number,
  ) => {
    if (page && page !== '1') {
      history.push(`/claims/list/1`)
    }

    const newSettingValue = settings[field] as number[]

    if (!newSettingValue) {
      updateSetting(field, [value])

      return
    }

    if (newSettingValue.includes(value as number)) {
      updateSetting(
        field,
        newSettingValue?.filter(
          (currentValue: number) => currentValue !== value,
        ),
      )
    } else {
      updateSetting(field, [...newSettingValue, value])
    }
  }

  const updateOutcomeFilterHandler = (value: string | null) => {
    if (!settings.outcomeFilterClaims) {
      updateSetting('outcomeFilterClaims', [value])
    }

    const currentValue = settings.outcomeFilterClaims

    if (!currentValue || typeof currentValue !== 'object') {
      return
    }

    if (!value) {
      updateSetting('outcomeFilterClaims', [])

      return
    }

    if (currentValue.includes(value)) {
      updateSetting(
        'outcomeFilterClaims',
        currentValue.filter((item) => item !== value),
      )

      return
    }

    updateSetting('outcomeFilterClaims', [...currentValue, value])
  }

  const updateNumberMemberSetting = (state: number) => {
    if (
      state === numberMemberGroups - 1 &&
      settings.memberGroupsFilterClaims &&
      settings.memberGroupsFilterClaims.includes(numberMemberGroups - 1)
    ) {
      updateSetting(
        'memberGroupsFilterClaims',
        settings.memberGroupsFilterClaims.filter((group) => group !== state),
      )
    }
  }

  const { register } = useNavigation()

  return (
    <FilterWrapper>
      <FilterElement>
        <Label>States</Label>
        {Object.values(ClaimState).map((state, index) => {
          const states = Object.keys(ClaimState)
          const stateName = convertEnumOrSentenceToTitle(state)
          const complexities = Object.keys(ClaimComplexity)

          const navigation = register(stateName, {
            focus: index === 0 ? Keys.F : undefined,
            resolve: () => {
              updateFilterHandler('claimStatesFilterClaims', state)
              return stateName
            },
            neighbors: {
              up: index ? states[index - 1] : undefined,
              down: index < states.length - 1 ? states[index + 1] : undefined,
              right:
                complexities[
                  index < complexities.length ? index : complexities.length - 1
                ],
            },
          })

          return (
            <Flex key={state} direction="row" align="center" {...navigation}>
              <Checkbox
                label={stateName}
                checked={settings.claimStatesFilterClaims?.includes(state)}
                onChange={() => {
                  updateFilterHandler('claimStatesFilterClaims', state)
                }}
              />
              <MemberGroupColorBadge
                style={{
                  height: '0.7em',
                  width: '0.7em',
                  backgroundColor: stateColors[state],
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
        {Object.values(ClaimComplexity).map((complexity, index) => {
          const complexities = Object.keys(ClaimComplexity)
          const complexityName = convertEnumOrSentenceToTitle(complexity)

          const navigation = register(complexityName, {
            resolve: () => {
              updateFilterHandler('claimComplexityFilterClaims', complexity)
              return complexityName
            },
            neighbors: {
              left: Object.keys(ClaimState)[index],
              up: index ? complexities[index - 1] : undefined,
              down:
                index < complexities.length - 1
                  ? complexities[index + 1]
                  : undefined,
              right: `Member Groups ${numberMemberGroupsOptions[index].label}`,
            },
          })

          return (
            <Flex
              key={complexity}
              direction="row"
              align="center"
              {...navigation}
            >
              <Checkbox
                label={complexityName}
                checked={settings.claimComplexityFilterClaims?.includes(
                  complexity,
                )}
                onChange={() => {
                  updateFilterHandler('claimComplexityFilterClaims', complexity)
                }}
              />
              <span style={{ marginLeft: '0.5rem' }}>
                {complexityIcons[complexity]}
              </span>
            </Flex>
          )
        })}
      </FilterElement>

      <FilterElement>
        <Label>Number of member groups</Label>
        {numberMemberGroupsOptions.map((option, index) => {
          const complexities = Object.keys(ClaimComplexity)
          const memberGroups = range(numberMemberGroups)

          const navigation = register(`Member Groups ${option.label}`, {
            resolve: () => {
              updateNumberMemberSetting(option.value)
              updateSetting('numberOfMemberGroups', option.value)
              setNumberMemberGroups(option.value)
              return `Member Groups ${option.label}`
            },
            neighbors: {
              left: complexities[
                index < complexities.length ? index : complexities.length - 1
              ],
              up: index
                ? `Member Groups ${numberMemberGroupsOptions[index - 1].label}`
                : undefined,
              down:
                index < numberMemberGroupsOptions.length - 1
                  ? `Member Groups ${
                      numberMemberGroupsOptions[index + 1].label
                    }`
                  : undefined,
              right: `Member Number ${
                memberGroups[
                  index < memberGroups.length ? index : memberGroups.length - 1
                ]
              }`,
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
                  updateSetting('numberOfMemberGroups', option.value)
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
          const memberNumbers = numberMemberGroupsOptions
          const markets = Object.keys(Market)

          const navigation = register(`Member Number ${filterNumber}`, {
            resolve: () => {
              updateFilterNumberHandler(
                'memberGroupsFilterClaims',
                filterNumber,
              )
              return `Member Number ${filterNumber}`
            },
            neighbors: {
              left: `Member Groups ${
                memberNumbers[
                  index < memberNumbers.length
                    ? index
                    : memberNumbers.length - 1
                ].label
              }`,
              up: index
                ? `Member Number ${range(numberMemberGroups)[index - 1]}`
                : undefined,
              down:
                index < range(numberMemberGroups).length - 1
                  ? `Member Number ${range(numberMemberGroups)[index + 1]}`
                  : undefined,
              right:
                markets[index < markets.length ? index : markets.length - 1],
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
                label={Object.keys(MemberGroups).find(
                  (_, index) => index === filterNumber,
                )}
                checked={settings.memberGroupsFilterClaims?.includes(
                  filterNumber,
                )}
                onChange={() => {
                  updateFilterNumberHandler(
                    'memberGroupsFilterClaims',
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
        {Object.values(Market).map((market, index) => {
          const markets = Object.keys(Market)
          const marketName = convertEnumOrSentenceToTitle(market)
          const memberGroups = range(numberMemberGroups)

          const navigation = register(marketName, {
            resolve: () => {
              updateFilterHandler('marketFilterClaims', market)
              return marketName
            },
            neighbors: {
              left: `Member Number ${
                memberGroups[
                  index < memberGroups.length ? index : memberGroups.length - 1
                ]
              }`,
              up: index ? markets[index - 1] : undefined,
              down: index < markets.length - 1 ? markets[index + 1] : undefined,
              right: `Outcome Filter`,
            },
          })

          return (
            <Flex key={market} direction="row" align="center" {...navigation}>
              <Checkbox
                label={marketName}
                checked={settings.marketFilterClaims?.includes(market)}
                onChange={() => {
                  updateFilterHandler('marketFilterClaims', market)
                }}
              />
              <span style={{ marginLeft: '0.5rem' }}>
                {MarketFlags[market]}
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
          outcomes={settings.outcomeFilterClaims}
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
