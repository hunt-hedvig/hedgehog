import styled from '@emotion/styled'
import { Label, lightTheme, Popover, TextDatePicker } from '@hedvig-ui'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { range } from '@hedvig-ui/utils/range'
import {
  FilterElement,
  FilterElementStyled,
  FilterNumberMemberGroups,
} from 'features/claims/claims-list/FilterElements'
import { Market, MarketFlags } from 'features/config/constants'
import { MemberGroupColorBadge } from 'features/questions/MemberGroupColorBadge'
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
import { OutcomeDropdown } from '../../claim-details/ClaimType/components/OutcomeDropdown'

export const FilterWrapper = styled.div`
  width: 100%;
  max-width: 1500px;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 2rem;
  align-items: flex-start;
  margin: 2rem 0;
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

const OutcomeFilter = styled(OutcomeDropdown)`
  padding: 0.5rem;
`

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
  date?: string | null
  setDate?: (date: string) => void
  page?: string
  navigationAvailable: boolean
}

export const ClaimListFilters: React.FC<ClaimListFiltersProps> = ({
  date,
  setDate,
  page,
  navigationAvailable,
  ...props
}) => {
  const history = useHistory()
  const { settings, updateSetting } = useMe()
  const { numberMemberGroups, setNumberMemberGroups } = useNumberMemberGroups()

  const settingExist = (field: UserSettingKey, value) => {
    if (!settings[field]) {
      return false
    }
    return !!settings[field].claims
      ? settings[field].claims.includes(value)
      : false
  }

  useEffect(() => {
    updateSetting(UserSettingKey.OutcomeFilter, {
      claims: [],
    })
  }, [])

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

  const setDateHandler = (newDate: Date | null) => {
    if (!newDate) {
      return
    }

    const dateString = new Date(newDate.setHours(newDate.getHours() + 2))
      .toISOString()
      .split('T')[0]

    setDate?.(dateString)
  }

  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep: 5,
    isActive: navigationAvailable,
    direction: 'horizontal',
    withNegative: true,
  })

  useEffect(() => {
    if (!navigationAvailable) {
      reset()
    }
  }, [navigationAvailable])

  return (
    <FilterWrapper {...props}>
      <FilterElement
        active={navigationAvailable && navigationStep + 1 === 0}
        checked={(key) =>
          settingExist(UserSettingKey.ClaimStatesFilter, ClaimState[key])
        }
        onChange={(key) =>
          updateFilterHandler(UserSettingKey.ClaimStatesFilter, ClaimState[key])
        }
        onPerfom={(index) =>
          updateFilterHandler(
            UserSettingKey.ClaimStatesFilter,
            ClaimState[Object.keys(ClaimState)[index + 1]],
          )
        }
        maxStep={Object.keys(ClaimState).length - 2}
        label="States"
        values={Object.keys(ClaimState)}
        onRender={(key) => (
          <MemberGroupColorBadge
            style={{
              height: '0.7em',
              width: '0.7em',
              backgroundColor: stateColors[key],
            }}
          />
        )}
      />

      <FilterElement
        active={navigationAvailable && navigationStep + 1 === 1}
        checked={(key) =>
          settingExist(
            UserSettingKey.ClaimComplexityFilter,
            ClaimComplexity[key],
          )
        }
        onChange={(key) =>
          updateFilterHandler(
            UserSettingKey.ClaimComplexityFilter,
            ClaimComplexity[key],
          )
        }
        onPerfom={(index) =>
          updateFilterHandler(
            UserSettingKey.ClaimComplexityFilter,
            ClaimComplexity[Object.keys(ClaimComplexity)[index + 1]],
          )
        }
        maxStep={Object.keys(ClaimComplexity).length - 2}
        label="Complexities"
        popover="A complex claim either has a reserve over 50k or is of type Water, Fire, Liability, Legal Protection or Flooding."
        values={Object.keys(ClaimComplexity)}
        onRender={(key) => (
          <span style={{ marginLeft: '0.5rem' }}>{complexityIcons[key]}</span>
        )}
      />

      <FilterNumberMemberGroups
        active={navigationAvailable && navigationStep + 1 === 2}
        numberMemberGroups={numberMemberGroups}
        setNumberMemberGroups={(value: number) => {
          updateNumberMemberSetting(value)
          updateSetting(UserSettingKey.NumberOfMemberGroups, { value })
          setNumberMemberGroups(value)
        }}
      />

      <FilterElement
        active={navigationAvailable && navigationStep + 1 === 3}
        checked={(key) => settingExist(UserSettingKey.MemberGroupsFilter, key)}
        onChange={(key) =>
          updateFilterHandler(UserSettingKey.MemberGroupsFilter, key)
        }
        onPerfom={(index) =>
          updateFilterHandler(UserSettingKey.MemberGroupsFilter, index + 1)
        }
        maxStep={numberMemberGroups - 2}
        checkboxLabel={FilterGroupState}
        label="Groups"
        values={range(numberMemberGroups)}
        onRender={(key) => (
          <MemberGroupColorBadge
            filter={+key}
            style={{ height: '0.7em', width: '0.7em' }}
          />
        )}
      />

      <FilterElement
        active={navigationAvailable && navigationStep + 1 === 4}
        checked={(key) =>
          settingExist(UserSettingKey.MarketFilter, Market[key])
        }
        onChange={(key) =>
          updateFilterHandler(UserSettingKey.MarketFilter, Market[key])
        }
        onPerfom={(index) =>
          updateFilterHandler(
            UserSettingKey.MarketFilter,
            Market[Object.keys(Market)[index + 1]],
          )
        }
        maxStep={Object.keys(Market).length - 2}
        values={Object.keys(Market)}
        label="Markets"
        onRender={(key) => (
          <span style={{ marginLeft: '0.5rem' }}>
            {MarketFlags[key.toUpperCase()]}
          </span>
        )}
      />

      <FilterElementStyled>
        <Label>Outcome</Label>
        <OutcomeFilter
          multi
          focus={navigationAvailable && navigationStep + 1 === 6}
          onSelect={updateOutcomeFilterHandler}
          outcome={
            (settings[UserSettingKey.OutcomeFilter] &&
              settings[UserSettingKey.OutcomeFilter].claims) ||
            null
          }
        />
      </FilterElementStyled>

      <FilterElementStyled>
        <LabelWithPopover
          label="Date up until"
          popover="The claim was registered either before or on this date."
        />
        <TextDatePicker
          focus={navigationAvailable && navigationStep + 1 === 6}
          value={date ? new Date(date) : new Date()}
          onChange={setDateHandler}
        />
      </FilterElementStyled>
    </FilterWrapper>
  )
}
