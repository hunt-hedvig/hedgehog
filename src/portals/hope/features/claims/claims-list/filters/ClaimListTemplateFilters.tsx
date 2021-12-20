import { Checkbox, Flex, Label } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import React from 'react'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'
import {
  complexityIcons,
  FilterElement,
  FilterGroupState,
  FilterWrapper,
  LabelWithPopover,
  stateColors,
} from 'portals/hope/features/claims/claims-list/filters/ClaimListFilters'
import { Market, MarketFlags } from 'portals/hope/features/config/constants'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { ClaimsFiltersType } from 'portals/hope/pages/claims/list/ClaimsListPage'
import { MemberGroupColorBadge } from 'portals/hope/features/questions/MemberGroupColorBadge'
import { NumberMemberGroupsRadioButtons } from 'portals/hope/features/questions/number-member-groups-radio-buttons'

interface ClaimListTemplateFiltersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  templateId: string
  template: ClaimsFiltersType
  editTemplate: (newFilter: ClaimsFiltersType, id?: string) => void
}

export const ClaimListTemplateFilters: React.FC<
  ClaimListTemplateFiltersProps
> = ({ template, editTemplate, templateId, ...props }) => {
  const { numberMemberGroups } = useNumberMemberGroups()

  const filterExists = (state: string | number, field: string) => {
    if (!template) {
      return false
    }

    if (!template[field]) {
      return false
    }

    return template[field].some((filterState) => filterState === state)
  }

  const setFilterHandler = (state: string | number, field: string) => {
    if (filterExists(state, field)) {
      editTemplate(
        {
          ...template,
          [field]: template[field].filter((st) => st !== state),
        },
        templateId,
      )
      return
    }

    editTemplate(
      {
        ...template,
        [field]: template[field] ? [...template[field], state] : [state],
      },
      templateId,
    )
  }

  const changeNumberMemberGroupsHandler = (
    numberOfMemberGroups: number,
    field: string,
  ) => {
    if (
      numberOfMemberGroups === 2 &&
      template.filterSelectedMemberGroups?.includes(2)
    ) {
      editTemplate(
        {
          ...template,
          [field]: numberOfMemberGroups,
          filterSelectedMemberGroups:
            template.filterSelectedMemberGroups.filter((num) => num !== 2),
        },
        templateId,
      )
    } else {
      editTemplate(
        {
          ...template,
          [field]: numberOfMemberGroups,
        },
        templateId,
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
