import { FilterSelect } from 'features/conversations/FilterSelect'
import { FilterState } from 'features/questions/filter'
import React from 'react'
import { useInsecurePersistentState } from 'utils/state'

export const Conversations: React.FC = () => {
  const [filters, setFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [
    FilterState.First,
    FilterState.Second,
    FilterState.Third,
    FilterState.Sweden,
    FilterState.Norway,
    FilterState.HasOpenClaim,
    FilterState.NoOpenClaim,
  ])

  return (
    <FilterSelect
      filters={filters}
      onSubmit={() => void 0}
      onToggle={(filter) => {
        if (filters.includes(filter)) {
          setFilters(filters.filter((prevFilter) => filter !== prevFilter))
        } else {
          setFilters([...filters, filter])
        }
      }}
    />
  )
}
