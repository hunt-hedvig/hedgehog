import { Checkbox, Flex, Label } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import {
  complexityIcons,
  FilterElement,
  FilterWrapper,
  LabelWithPopover,
  stateColors,
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
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'
import { NumberMemberGroupsRadioButtons } from 'portals/hope/features/questions/number-member-groups-radio-buttons'

interface ClaimTemplateFiltersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  templateId?: string
  template: ClaimsFiltersType
  editTemplate: (newFilter: ClaimsFiltersType, id?: string) => void
}

export const ClaimTemplateFilters: React.FC<ClaimTemplateFiltersProps> = ({
  template,
  editTemplate,
  templateId,
  ...props
}) => {
  const { numberMemberGroups } = useNumberMemberGroups()

  const filterExists = (
    state: string | number,
    field: keyof ClaimsFiltersType,
  ) => {
    if (!template) {
      return false
    }

    const value = template[field]

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
    const value = template[field]

    if (filterExists(state, field)) {
      if (!Array.isArray(value)) {
        return
      }

      editTemplate(
        {
          ...template,
          [field]: (value as unknown[]).filter((st) => st !== state),
        },
        templateId,
      )

      return
    }

    if (!Array.isArray(value)) {
      editTemplate(
        {
          ...template,
          [field]: value ? [value, state] : [state],
        },
        templateId,
      )

      return
    }

    editTemplate(
      {
        ...template,
        [field]: value ? [...value, state] : [state],
      },
      templateId,
    )
  }

  const changeNumberMemberGroupsHandler = (
    state: number,
    field: keyof ClaimsFiltersType,
  ) => {
    if (template.filterSelectedMemberGroups) {
      editTemplate(
        {
          ...template,
          [field]: state,
          filterSelectedMemberGroups:
            template.filterSelectedMemberGroups.filter(
              (number) => number < state,
            ),
        },
        templateId,
      )

      return
    }

    editTemplate(
      {
        ...template,
        [field]: state,
      },
      templateId,
    )
  }

  return (
    <FilterWrapper {...props}>
      <FilterElement>
        <Label>States</Label>
        {Object.values(ClaimState).map((state) => (
          <Flex key={state} direction="row" align="center">
            <Checkbox
              label={state.charAt(0) + state.toLowerCase().slice(1)}
              checked={filterExists(state, 'filterClaimStates')}
              onChange={() => setFilterHandler(state, 'filterClaimStates')}
            />
            <MemberGroupColorBadge
              style={{
                height: '0.7em',
                width: '0.7em',
                backgroundColor: stateColors[state],
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
              label={complexity.charAt(0) + complexity.toLowerCase().slice(1)}
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
            style={
              templateId
                ? {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.7rem',
                  }
                : {}
            }
            groupsNumber={template.filterNumberOfMemberGroups || undefined}
            setGroupsNumber={(e: number) =>
              changeNumberMemberGroupsHandler(e, 'filterNumberOfMemberGroups')
            }
          />
        </Flex>
      </FilterElement>

      <FilterElement>
        <Label>Groups</Label>
        {range(template?.filterNumberOfMemberGroups || numberMemberGroups).map(
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
              label={market.charAt(0) + market.toLowerCase().slice(1)}
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
