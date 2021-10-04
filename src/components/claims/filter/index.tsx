import styled from '@emotion/styled'
import { Checkbox, DateTimePicker, Label } from '@hedvig-ui'
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
  grid-template-columns: 400px 230px 20px;
  align-items: flex-end;
  column-gap: 1em;
`

const CloseWrapper = styled.div`
  height: 42px;
  display: flex;
  align-items: center;
`

export const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const isExist = (state) =>
    !!filters.filterClaimStates.filter((st) => st === state).length

  const setFilterClaimState = (state: ClaimState) => {
    if (isExist(state)) {
      setFilters((prev) => ({
        ...prev,
        filterClaimStates: prev.filterClaimStates.filter((st) => st !== state),
      }))

      return
    }

    setFilters((prev) => ({
      ...prev,
      filterClaimStates: [...prev.filterClaimStates, state],
    }))
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

  React.useEffect(() => {
    console.log(filters.filterClaimStates)
  }, [filters.filterClaimStates])

  return (
    <FilterWrapper>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          marginBottom: 10,
        }}
      >
        <Checkbox
          label="Opened"
          checked={isExist(ClaimState.Open)}
          onChange={() => setFilterClaimState(ClaimState.Open)}
        />
        <Checkbox
          label="Closed"
          checked={isExist(ClaimState.Closed)}
          onChange={() => setFilterClaimState(ClaimState.Closed)}
        />
        <Checkbox
          label="Reopened"
          checked={isExist(ClaimState.Reopened)}
          onChange={() => setFilterClaimState(ClaimState.Reopened)}
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

      {(filters.filterClaimStates.length ||
        filters.filterCreatedBeforeOrOnDate) && (
        <CloseWrapper>
          <CloseIcon onClick={resetFiltersHandler} />
        </CloseWrapper>
      )}
    </FilterWrapper>
  )
}
