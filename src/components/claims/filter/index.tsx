import styled from '@emotion/styled'
import { Checkbox, DateTimePicker, Label, lightTheme } from '@hedvig-ui'
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
  display: flex;
  align-items: flex-end;
  gap: 5rem;
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
    setFilters((prev) => ({
      ...prev,
      filterNumberOfMemberGroups: numberMemberGroups,
    }))
  }, [numberMemberGroups])

  const setDateHandler = (e: Date) => {
    const date = e.toISOString().split('T')[0]
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
    Open: lightTheme.activeInsuranceBackground,
    Closed: lightTheme.accent,
    Reopened: lightTheme.accentLight,
  }

  return (
    <FilterWrapper>
      <FilterElement>
        <Label>Claim States</Label>
        {Object.keys(ClaimState).map((key) => (
          <div>
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
          </div>
        ))}
      </FilterElement>

      <FilterElement>
        <Label>Claim Complexities</Label>
        {Object.keys(ClaimComplexity).map((key) => (
          <div>
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
          </div>
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
          <div>
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
          </div>
        ))}
      </FilterElement>

      <FilterElement>
        <Label>Markets</Label>
        {Object.keys(Market).map((key) => (
          <div>
            <Checkbox
              label={key}
              checked={isFilterExist(Market[key], 'filterMarkets') || false}
              onChange={() => setFilterHandler(Market[key], 'filterMarkets')}
            />
            <span style={{ marginLeft: '0.5rem' }}>{marketIcons[key]}</span>
          </div>
        ))}
      </FilterElement>

      <FilterElement>
        <Label>Created date</Label>
        <DateTimePicker
          date={
            filters.filterCreatedBeforeOrOnDate
              ? new Date(filters.filterCreatedBeforeOrOnDate)
              : new Date()
          }
          setDate={setDateHandler}
        />
      </FilterElement>
    </FilterWrapper>
  )
}
