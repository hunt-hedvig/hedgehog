import styled from '@emotion/styled'
import { DateTimePicker, Dropdown } from '@hedvig-ui'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React from 'react'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { ClaimState } from 'types/generated/graphql'

interface FiltersProps {
  filters: ClaimsFiltersType
  setFilters: any
}

const FilterWrapper = styled.div`
  margin-top: 2em;

  display: grid;
  grid-template-columns: 230px 230px 20px;
  align-items: center;
  column-gap: 1em;
`

export const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const changeClaimStateHandler = (e: string) => {
    setFilters((prev) => ({ ...prev, filterClaimStates: [e] }))
  }

  const setDateHandler = (e: Date) => {
    const date = e.toISOString().split('T')[0]
    setFilters((prev) => ({ ...prev, filterCreatedBeforeOrOnDate: date }))
  }

  const resetFiltersHandler = () => {
    setFilters({
      filterClaimStates: [],
      filterCreatedBeforeOrOnDate: null,
    })
  }

  return (
    <FilterWrapper>
      <Dropdown
        value={filters.filterClaimStates[0] || ''}
        onChange={changeClaimStateHandler}
        options={[
          { key: 0, value: ClaimState.Open, text: 'Open' },
          { key: 1, value: ClaimState.Closed, text: 'Closed' },
          { key: 2, value: ClaimState.Reopened, text: 'Reopened' },
        ]}
      />
      <DateTimePicker
        date={
          filters.filterCreatedBeforeOrOnDate
            ? new Date(filters.filterCreatedBeforeOrOnDate)
            : new Date()
        }
        setDate={setDateHandler}
      />

      {(filters.filterClaimStates.length ||
        filters.filterCreatedBeforeOrOnDate) && (
        <CloseIcon onClick={resetFiltersHandler} />
      )}
    </FilterWrapper>
  )
}
