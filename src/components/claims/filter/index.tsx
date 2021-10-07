import styled from '@emotion/styled'
import { Checkbox, DateTimePicker, Label } from '@hedvig-ui'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React from 'react'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'

interface FiltersProps {
  filters: ClaimsFiltersType
  setFilters: any
}

const FilterWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3rem;
  margin: 2rem 0;
`

const FilterElement = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const isFilterExist = (state, field) =>
    filters[field] && !!filters[field].filter((st) => st === state).length

  const setFilterHandler = (state: string, field) => {
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

  const setDateHandler = (e: Date) => {
    const date = e.toISOString().split('T')[0]
    setFilters((prev) => ({ ...prev, filterCreatedBeforeOrOnDate: date }))
  }

  return (
    <FilterWrapper>
      <FilterElement>
        {Object.keys(ClaimState).map((key) => (
          <Checkbox
            label={key}
            checked={
              isFilterExist(ClaimState[key], 'filterClaimStates') || false
            }
            onChange={() =>
              setFilterHandler(ClaimState[key], 'filterClaimStates')
            }
          />
        ))}
      </FilterElement>

      <FilterElement>
        {Object.keys(ClaimComplexity).map((key) => (
          <Checkbox
            label={key}
            checked={
              isFilterExist(ClaimComplexity[key], 'filterComplexities') || false
            }
            onChange={() =>
              setFilterHandler(ClaimComplexity[key], 'filterComplexities')
            }
          />
        ))}
      </FilterElement>

      <div>
        <Label>Created date</Label>
        <DateTimePicker
          date={
            filters.filterCreatedBeforeOrOnDate
              ? new Date(filters.filterCreatedBeforeOrOnDate)
              : new Date()
          }
          setDate={setDateHandler}
        />
      </div>
    </FilterWrapper>
  )
}
