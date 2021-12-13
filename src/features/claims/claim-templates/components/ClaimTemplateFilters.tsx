import { range } from '@hedvig-ui/utils/range'
import {
  complexityIcons,
  FilterGroupState,
  FilterWrapper,
  stateColors,
} from 'features/claims/claims-list/filters/ClaimListFilters'
import { Market, MarketFlags } from 'features/config/constants'
import { MemberGroupColorBadge } from 'features/questions/MemberGroupColorBadge'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React from 'react'
import { useHistory } from 'react-router'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'
import {
  FilterElement,
  FilterNumberMemberGroups,
} from '../../claims-list/FilterElements'

interface ClaimTemplateFiltersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  filters: ClaimsFiltersType
  setFilters: (newFilter: ClaimsFiltersType) => void
  page?: string
}

export const ClaimTemplateFilters: React.FC<ClaimTemplateFiltersProps> = ({
  filters,
  setFilters,
  page,
  ...props
}) => {
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()

  const filterExists = (state: string | number, field: string) => {
    if (!filters) {
      return false
    }

    if (!filters[field]) {
      return false
    }

    return filters[field].some((filterState) => filterState === state)
  }

  const setFilterHandler = (state: string | number, field: string) => {
    if (page && page !== '1') {
      history.push(`/claims/list/1`)
    }

    if (filterExists(state, field)) {
      setFilters({
        ...filters,
        [field]: filters[field].filter((st) => st !== state),
      })

      return
    }

    setFilters({
      ...filters,
      [field]: filters[field] ? [...filters[field], state] : [state],
    })
  }

  const changeNumberMemberGroupsHandler = (state: number, field: string) => {
    if (state === 2 && filters.filterSelectedMemberGroups?.includes(2)) {
      setFilters({
        ...filters,
        [field]: state,
        filterSelectedMemberGroups: filters.filterSelectedMemberGroups.filter(
          (num) => num !== 2,
        ),
      })
    } else {
      setFilters({
        ...filters,
        [field]: state,
      })
    }
  }

  return (
    <FilterWrapper {...props}>
      <FilterElement
        checked={(key) => filterExists(ClaimState[key], 'filterClaimStates')}
        onChange={(key) =>
          setFilterHandler(ClaimState[key], 'filterClaimStates')
        }
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
        checked={(key) =>
          filterExists(ClaimComplexity[key], 'filterComplexities')
        }
        onChange={(key) =>
          setFilterHandler(ClaimComplexity[key], 'filterComplexities')
        }
        label="Complexities"
        popover="A complex claim either has a reserve over 50k or is of type Water, Fire, Liability, Legal Protection or Flooding."
        values={Object.keys(ClaimComplexity)}
        onRender={(key) => (
          <span style={{ marginLeft: '0.5rem' }}>{complexityIcons[key]}</span>
        )}
      />

      <FilterNumberMemberGroups
        numberMemberGroups={filters.filterNumberOfMemberGroups || undefined}
        setNumberMemberGroups={(value: number) => {
          changeNumberMemberGroupsHandler(value, 'filterNumberOfMemberGroups')
        }}
      />

      <FilterElement
        checked={(filterNumber) =>
          filterExists(filterNumber, 'filterSelectedMemberGroups')
        }
        onChange={(filterNumber) =>
          setFilterHandler(filterNumber, 'filterSelectedMemberGroups')
        }
        checkboxLabel={FilterGroupState}
        label="Groups"
        values={range(
          filters?.filterNumberOfMemberGroups || numberMemberGroups,
        )}
        onRender={(filterNumber) => (
          <MemberGroupColorBadge
            filter={+filterNumber}
            style={{ height: '0.7em', width: '0.7em' }}
          />
        )}
      />

      <FilterElement
        checked={(key) => filterExists(Market[key], 'filterMarkets')}
        onChange={(key) => setFilterHandler(Market[key], 'filterMarkets')}
        values={Object.keys(Market)}
        label="Markets"
        onRender={(key) => (
          <span style={{ marginLeft: '0.5rem' }}>
            {MarketFlags[key.toUpperCase()]}
          </span>
        )}
      />
    </FilterWrapper>
  )
}
