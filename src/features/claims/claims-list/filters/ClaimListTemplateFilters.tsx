import { Checkbox, Flex, Label } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import {
  complexityIcons,
  FilterElement,
  FilterGroupState,
  FilterWrapper,
  LabelWithPopover,
  stateColors,
} from 'features/claims/claims-list/filters/ClaimListFilters'
import { Market, MarketFlags } from 'features/config/constants'
import { MemberGroupColorBadge } from 'features/questions/MemberGroupColorBadge'
import { NumberMemberGroupsRadioButtons } from 'features/questions/number-member-groups-radio-buttons'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React from 'react'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'

interface ClaimListTemplateFiltersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  templatedId: string
  filters: ClaimsFiltersType
  setFilters: (newFilter: ClaimsFiltersType, id?: string) => void
}

export const ClaimListTemplateFilters: React.FC<ClaimListTemplateFiltersProps> = ({
  filters,
  setFilters,
  templatedId,
  ...props
}) => {
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
    if (filterExists(state, field)) {
      setFilters(
        {
          ...filters,
          [field]: filters[field].filter((st) => st !== state),
        },
        templatedId,
      )
      return
    }

    setFilters(
      {
        ...filters,
        [field]: filters[field] ? [...filters[field], state] : [state],
      },
      templatedId,
    )
  }

  const changeNumberMemberGroupsHandler = (
    numberOfMemberGroups: number,
    field: string,
  ) => {
    if (
      numberOfMemberGroups === 2 &&
      filters.filterSelectedMemberGroups?.includes(2)
    ) {
      setFilters(
        {
          ...filters,
          [field]: numberOfMemberGroups,
          filterSelectedMemberGroups: filters.filterSelectedMemberGroups.filter(
            (num) => num !== 2,
          ),
        },
        templatedId,
      )
    } else {
      setFilters(
        {
          ...filters,
          [field]: numberOfMemberGroups,
        },
        templatedId,
      )
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
