import { Checkbox, Flex, Label, lightTheme, Popover } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import { Market, MarketFlags } from 'features/config/constants'
import { MemberGroupColorBadge } from 'features/questions/MemberGroupColorBadge'
import { NumberMemberGroupsRadioButtons } from 'features/questions/number-member-groups-radio-buttons'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React from 'react'
import { InfoCircle } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'
import { FilterElement, FilterWrapper, StyledLabel } from './ClaimListFilters'

const complexityIcons = {
  Simple: '📱',
  Complex: '🌊',
}

const stateColors = {
  Open: lightTheme.accent,
  Closed: lightTheme.activeInsuranceBackground,
  Reopened: lightTheme.accentLight,
}

const LabelWithPopover: React.FC<{ label: string; popover: string }> = ({
  label,
  popover,
}) => (
  <StyledLabel>
    <span>{label}</span>
    <Popover style={{ width: 250 }} contents={popover}>
      <InfoCircle />
    </Popover>
  </StyledLabel>
)

export enum FilterGroupState {
  First,
  Second,
  Third,
}

interface FiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  templatedId?: number
  filters: ClaimsFiltersType
  setFilters: (newFilter: ClaimsFiltersType, id?: number) => void
  page?: string
}

export const ClaimListTemplateFilters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  page,
  templatedId,
  ...props
}) => {
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()

  const isFilterExist = (state, field) =>
    filters &&
    filters[field] &&
    !!filters[field].filter((st) => st === state).length

  const setFilterHandler = (state: string | number, field) => {
    const idExist = typeof templatedId === 'number'
    if (isFilterExist(state, field)) {
      if (idExist) {
        setFilters(
          {
            ...filters,
            [field]: filters[field].filter((st) => st !== state),
          },
          templatedId,
        )
      } else {
        setFilters({
          ...filters,
          [field]: filters[field].filter((st) => st !== state),
        })
      }

      if (page && page !== '1') {
        history.push(`/claims/list/1`)
      }

      return
    }

    if (idExist) {
      setFilters(
        {
          ...filters,
          [field]: filters[field] ? [...filters[field], state] : [state],
        },
        templatedId,
      )
    } else {
      setFilters({
        ...filters,
        [field]: filters[field] ? [...filters[field], state] : [state],
      })
    }

    if (page && page !== '1') {
      history.push(`/claims/list/1`)
    }
  }

  const changeNumberMemberGroupsHandler = (state: number, field: string) => {
    const idExist = typeof templatedId === 'number'
    if (state === 2 && filters.filterSelectedMemberGroups?.includes(2)) {
      if (idExist) {
        setFilters(
          {
            ...filters,
            [field]: state,
            filterSelectedMemberGroups: filters.filterSelectedMemberGroups.filter(
              (num) => num !== 2,
            ),
          },
          templatedId,
        )
      } else {
        setFilters({
          ...filters,
          [field]: state,
          filterSelectedMemberGroups: filters.filterSelectedMemberGroups.filter(
            (num) => num !== 2,
          ),
        })
      }
    } else {
      if (idExist) {
        setFilters(
          {
            ...filters,
            [field]: state,
          },
          templatedId,
        )
      } else {
        setFilters({
          ...filters,
          [field]: state,
        })
      }
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
              checked={
                isFilterExist(ClaimState[key], 'filterClaimStates') || false
              }
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
              checked={
                isFilterExist(ClaimComplexity[key], 'filterComplexities') ||
                false
              }
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
        <div style={{ display: 'flex' }}>
          <NumberMemberGroupsRadioButtons
            groupsNumber={filters?.filterNumberOfMemberGroups || undefined}
            setGroupsNumber={(e: number) =>
              changeNumberMemberGroupsHandler(e, 'filterNumberOfMemberGroups')
            }
          />
        </div>
      </FilterElement>

      <FilterElement>
        <Label>Groups</Label>
        {range(filters?.filterNumberOfMemberGroups || numberMemberGroups).map(
          (filterNumber) => (
            <Flex key={filterNumber} direction="row" align="center">
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
              checked={isFilterExist(Market[key], 'filterMarkets') || false}
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
