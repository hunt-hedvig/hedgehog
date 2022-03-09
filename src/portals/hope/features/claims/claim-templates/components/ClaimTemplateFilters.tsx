import { Checkbox, Flex, Label } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import {
  complexityIcons,
  FilterElement,
  FilterWrapper,
  LabelWithPopover,
} from 'portals/hope/features/claims/claims-list/filters/ClaimListFilters'
import {
  Market,
  MarketFlags,
  MemberGroups,
} from 'portals/hope/features/config/constants'
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

  const filterExists = (
    state: string | number,
    field: keyof ClaimsFiltersType,
  ) => {
    if (!filters) {
      return false
    }

    const value = filters[field]

    if (!value) {
      return false
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return true
    }

    return value.some((filterState) => filterState === state)
  }

  const setFilterHandler = (
    state: string | number,
    field: keyof ClaimsFiltersType,
  ) => {
    if (page && page !== '1') {
      history.push(`/claims/list/1`)
    }

    if (filterExists(state, field)) {
      const value = filters[field]

      if (!Array.isArray(value)) {
        return
      }

      setFilters({
        ...filters,
        [field]: (value as unknown[]).filter((st) => st !== state),
      })

      return
    }

    const value = filters[field]

    if (!Array.isArray(value)) {
      return
    }

    setFilters({
      ...filters,
      [field]: filters[field] ? [...value, state] : [state],
    })
  }

  const changeNumberMemberGroupsHandler = (
    state: number,
    field: keyof ClaimsFiltersType,
  ) => {
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
        {Object.values(ClaimState).map((state) => (
          <Flex key={state} direction="row" align="center">
            <Checkbox
              label={state}
              checked={filterExists(state, 'filterClaimStates')}
              onChange={() => setFilterHandler(state, 'filterClaimStates')}
            />
            <MemberGroupColorBadge
              style={{
                height: '0.7em',
                width: '0.7em',
                backgroundColor: state,
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
        {Object.values(ClaimComplexity).map((complexity) => (
          <Flex key={complexity} direction="row" align="center">
            <Checkbox
              label={complexity}
              checked={filterExists(complexity, 'filterComplexities')}
              onChange={() =>
                setFilterHandler(complexity, 'filterComplexities')
              }
            />
            <span style={{ marginLeft: '0.5rem' }}>
              {complexityIcons[complexity]}
            </span>
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
                label={Object.keys(MemberGroups).find(
                  (_, index) => index === filterNumber,
                )}
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
        {Object.values(Market).map((market) => (
          <Flex key={market} direction="row" align="center">
            <Checkbox
              label={market}
              checked={filterExists(market, 'filterMarkets')}
              onChange={() => setFilterHandler(market, 'filterMarkets')}
            />
            <span style={{ marginLeft: '0.5rem' }}>{MarketFlags[market]}</span>
          </Flex>
        ))}
      </FilterElement>
    </FilterWrapper>
  )
}
