import { Checkbox, Flex, Label } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import {
  complexityIcons,
  FilterElement,
  FilterGroupState,
  FilterWrapper,
  LabelWithPopover,
  stateColors,
} from 'portals/hope/features/claims/claims-list/filters/ClaimListFilters'
import { Market, MarketFlags } from 'portals/hope/features/config/constants'
import { MemberGroupColorBadge } from 'portals/hope/features/questions/MemberGroupColorBadge'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { ClaimsFiltersType } from 'portals/hope/pages/claims/list/ClaimsListPage'
import React from 'react'
import { useHistory } from 'react-router'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'
import { NumberMemberGroupsRadioButtons } from 'portals/hope/features/questions/number-member-groups-radio-buttons'

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
      <FilterElement>
        <Label>States</Label>
        {Object.keys(ClaimState).map((key) => (
          <Flex key={key} direction="row" align="center">
            <Checkbox
              label={key}
              checked={filterExists(ClaimState[key], 'filterClaimStates')}
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
              checked={filterExists(ClaimComplexity[key], 'filterComplexities')}
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
        <Flex>
          <NumberMemberGroupsRadioButtons
            groupsNumber={filters.filterNumberOfMemberGroups || undefined}
            setGroupsNumber={(e: number) =>
              changeNumberMemberGroupsHandler(e, 'filterNumberOfMemberGroups')
            }
          />
        </Flex>
      </FilterElement>

      <FilterElement>
        <Label>Groups</Label>
        {range(filters?.filterNumberOfMemberGroups || numberMemberGroups).map(
          (filterNumber) => (
            <Flex key={filterNumber} direction="row" align="center">
              <Checkbox
                label={FilterGroupState[filterNumber]}
                checked={filterExists(
                  filterNumber,
                  'filterSelectedMemberGroups',
                )}
                onChange={() =>
                  setFilterHandler(filterNumber, 'filterSelectedMemberGroups')
                }
              />
              <MemberGroupColorBadge
                filter={filterNumber}
                style={{ height: '0.7em', width: '0.7em' }}
              />
            </Flex>
          ),
        )}
      </FilterElement>

      <FilterElement>
        <Label>Markets</Label>
        {Object.keys(Market).map((key) => (
          <Flex key={key} direction="row" align="center">
            <Checkbox
              label={key}
              checked={filterExists(Market[key], 'filterMarkets')}
              onChange={() => setFilterHandler(Market[key], 'filterMarkets')}
            />
            <span style={{ marginLeft: '0.5rem' }}>
              {MarketFlags[key.toUpperCase()]}
            </span>
          </Flex>
        ))}
      </FilterElement>
    </FilterWrapper>
  )
}
