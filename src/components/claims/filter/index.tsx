import styled from '@emotion/styled'
import { DateTimePicker, Dropdown, Label } from '@hedvig-ui'
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
  align-items: flex-end;
  column-gap: 1em;
`

const CloseWrapper = styled.div`
  height: 42px;
  display: flex;
  align-items: center;
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
      filterClaimStates: null,
      filterCreatedBeforeOrOnDate: null,
    })
  }

  return (
    <FilterWrapper>
      <div>
        <Label>Claim state</Label>
        <Dropdown
          value={filters.filterClaimStates ? filters.filterClaimStates[0] : ''}
          onChange={changeClaimStateHandler}
          options={[
            { key: 0, value: ClaimState.Open, text: 'Open' },
            { key: 1, value: ClaimState.Closed, text: 'Closed' },
            { key: 2, value: ClaimState.Reopened, text: 'Reopened' },
          ]}
        />
      </div>

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

      {(filters.filterClaimStates || filters.filterCreatedBeforeOrOnDate) && (
        <CloseWrapper>
          <CloseIcon onClick={resetFiltersHandler} />
        </CloseWrapper>
      )}
    </FilterWrapper>
  )
}
