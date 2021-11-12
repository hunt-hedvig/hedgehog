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
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React from 'react'
import { InfoCircle } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'

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
  filters: ClaimsFiltersType
  setFilters: any
  page?: string
}

export const ClaimListFilters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  page,
}) => {
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()

  const isFilterExist = (state, field) =>
    filters[field] && !!filters[field].filter((st) => st === state).length

  const setFilterHandler = (state: string | number, field) => {
    if (isFilterExist(state, field)) {
      setFilters((prev) => ({
        ...prev,
        [field]: prev[field].filter((st) => st !== state),
      }))

      if (page && page !== '1') {
        history.push(`/claims/list/1`)
      }

      return
    }

    setFilters((prev) => ({
      ...prev,
      [field]: prev[field] ? [...prev[field], state] : [state],
    }))

    if (page && page !== '1') {
      history.push(`/claims/list/1`)
    }
  }

  React.useEffect(() => {
    if (
      numberMemberGroups === 2 &&
      filters.filterSelectedMemberGroups &&
      filters.filterSelectedMemberGroups.length > 2
    ) {
      setFilters((prev) => ({
        ...prev,
        filterNumberOfMemberGroups: numberMemberGroups,
        filterSelectedMemberGroups: [0, 1],
      }))
    } else {
      setFilters((prev) => ({
        ...prev,
        filterNumberOfMemberGroups: numberMemberGroups,
      }))
    }
  }, [numberMemberGroups])

  const setDateHandler = (date: Date | null) => {
    if (!date) {
      return
    }

    const dateString = new Date(date.setHours(date.getHours() + 2))
      .toISOString()
      .split('T')[0]

    setFilters((prev) => ({ ...prev, filterCreatedBeforeOrOnDate: dateString }))
  }

  const complexityIcons = {
    Simple: '📱',
    Complex: '🌊',
  }

  const stateColors = {
    Open: lightTheme.accent,
    Closed: lightTheme.activeInsuranceBackground,
    Reopened: lightTheme.accentLight,
  }

  return (
    <FilterWrapper>
      <FilterElement>
        <Label>States</Label>
        {Object.keys(ClaimState).map((key) => (
          <Flex key={key} direction="row" align="center">
            <Checkbox
              label={key}
              checked={
                isFilterExist(ClaimState[key], 'filterClaimStates') || false
              }
              onChange={() =>
                setFilterHandler(ClaimState[key], 'filterClaimStates')
              }
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
                isFilterExist(ClaimComplexity[key], 'filterComplexities') ||
                false
              }
              onChange={() =>
                setFilterHandler(ClaimComplexity[key], 'filterComplexities')
              }
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
                isFilterExist(filterNumber, 'filterSelectedMemberGroups') ||
                false
              }
              onChange={() =>
                setFilterHandler(filterNumber, 'filterSelectedMemberGroups')
              }
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
              checked={isFilterExist(Market[key], 'filterMarkets') || false}
              onChange={() => setFilterHandler(Market[key], 'filterMarkets')}
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
          value={
            filters.filterCreatedBeforeOrOnDate
              ? new Date(filters.filterCreatedBeforeOrOnDate)
              : new Date()
          }
          onChange={setDateHandler}
        />
      </FilterElement>
    </FilterWrapper>
  )
}
