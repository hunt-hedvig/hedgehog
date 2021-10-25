import styled from '@emotion/styled'
import { Checkbox, Flex, Label, lightTheme, TextDatePicker } from '@hedvig-ui'
import { ColorBadge } from 'features/questions/filter'
import { NumberMemberGroupsRadioButtons } from 'features/questions/number-member-groups-radio-buttons'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React from 'react'
import { Market } from 'types/enums'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'
import { range } from 'utils/array'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

interface FiltersProps {
  filters: ClaimsFiltersType
  setFilters: any
}

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

export enum FilterGroupState {
  First,
  Second,
  Third,
}

export const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const { numberMemberGroups } = useNumberMemberGroups()

  const isFilterExist = (state, field) =>
    filters[field] && !!filters[field].filter((st) => st === state).length

  const setFilterHandler = (state: string | number, field) => {
    if (isFilterExist(state, field)) {
      setFilters((prev) => ({
        ...prev,
        [field]: prev[field].filter((st) => st !== state),
      }))

      return
    }

    setFilters((prev) => ({
      ...prev,
      [field]: prev[field] ? [...prev[field], state] : [state],
    }))
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

  const setDateHandler = (e: Date | null) => {
    if (!e) {
      return
    }

    const date = new Date(e.setHours(e.getHours() + 2))
      .toISOString()
      .split('T')[0]

    setFilters((prev) => ({ ...prev, filterCreatedBeforeOrOnDate: date }))
  }

  const marketIcons = {
    Sweden: '🇸🇪',
    Norway: '🇳🇴',
    Denmark: '🇩🇰',
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
          <Flex direction="row" align="center">
            <Checkbox
              label={key}
              checked={
                isFilterExist(ClaimState[key], 'filterClaimStates') || false
              }
              onChange={() =>
                setFilterHandler(ClaimState[key], 'filterClaimStates')
              }
            />
            <ColorBadge
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
        <Label>Complexities</Label>
        {Object.keys(ClaimComplexity).map((key) => (
          <Flex direction="row" align="center">
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
          <Flex direction="row" align="center">
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
            <ColorBadge
              filter={filterNumber}
              style={{ height: '0.7em', width: '0.7em' }}
            />
          </Flex>
        ))}
      </FilterElement>

      <FilterElement>
        <Label>Markets</Label>
        {Object.keys(Market).map((key) => (
          <Flex direction="row" align="center">
            <Checkbox
              label={key}
              checked={isFilterExist(Market[key], 'filterMarkets') || false}
              onChange={() => setFilterHandler(Market[key], 'filterMarkets')}
            />
            <span style={{ marginLeft: '0.5rem' }}>{marketIcons[key]}</span>
          </Flex>
        ))}
      </FilterElement>

      <FilterElement>
        <Label>Registration dates</Label>
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
