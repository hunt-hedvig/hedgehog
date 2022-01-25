import { Checkbox, Flex, Label, Radio } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import React from 'react'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'
import {
  complexityIcons,
  FilterElement,
  FilterGroupState,
  FilterWrapper,
  LabelWithPopover,
} from 'portals/hope/features/claims/claims-list/filters/ClaimListFilters'
import { Market, MarketFlags } from 'portals/hope/features/config/constants'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { ClaimsFiltersType } from 'portals/hope/pages/claims/list/ClaimsListPage'
import { MemberGroupColorBadge } from 'portals/hope/features/questions/MemberGroupColorBadge'
import { numberMemberGroupsOptions } from 'portals/hope/features/questions/number-member-groups-radio-buttons'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'

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
    if (filterExists(state, field)) {
      const value = template[field]

      if (!Array.isArray(value)) {
        return
      }

      editTemplate(
        {
          ...template,
          [field]: (value as unknown[]).filter((st: unknown) => st !== state),
        },
        templateId,
      )
      return
    }

    const value = template[field]

    if (!Array.isArray(value)) {
      return
    }

    editTemplate(
      {
        ...template,
        [field]: template[field] ? [...value, state] : [state],
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

  const { register } = useNavigation()

  return (
    <FilterWrapper {...props}>
      <FilterElement>
        <Label>States</Label>
        {Object.values(ClaimState).map((state, index) => {
          const navigation = register(state, {
            focus: index === 0 ? Keys.F : undefined,
            resolve: () => {
              setFilterHandler(state, 'filterClaimStates')
            },
            neighbors: {
              up: index ? Object.keys(ClaimState)[index - 1] : undefined,
              down:
                index < Object.keys(ClaimState).length - 1
                  ? Object.keys(ClaimState)[index + 1]
                  : undefined,
              right: Object.keys(ClaimComplexity)[0],
            },
          })

          return (
            <Flex key={state} direction="row" align="center" {...navigation}>
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
          )
        })}
      </FilterElement>

      <FilterElement>
        <LabelWithPopover
          label="Complexities"
          popover="A complex claim either has a reserve over 50k or is of type Water, Fire, Liability, Legal Protection or Flooding."
        />
        {Object.values(ClaimComplexity).map((complexity, index) => {
          const navigation = register(complexity, {
            resolve: () => {
              setFilterHandler(complexity, 'filterComplexities')
            },
            neighbors: {
              left: Object.keys(ClaimState)[0],
              up: index ? Object.keys(ClaimComplexity)[index - 1] : undefined,
              down:
                index < Object.keys(ClaimComplexity).length - 1
                  ? Object.keys(ClaimComplexity)[index + 1]
                  : undefined,
              right: `Member Groups ${numberMemberGroupsOptions[0].label}`,
            },
          })

          return (
            <Flex
              key={complexity}
              direction="row"
              align="center"
              {...navigation}
            >
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
          )
        })}
      </FilterElement>

      <FilterElement>
        <Label>Number of member groups</Label>
        {numberMemberGroupsOptions.map((option, index) => {
          const navigation = register(`Member Groups ${option.label}`, {
            resolve: () => {
              changeNumberMemberGroupsHandler(
                option.value,
                'filterNumberOfMemberGroups',
              )
            },
            neighbors: {
              left: Object.keys(ClaimComplexity)[0],
              up: index
                ? `Member Groups ${numberMemberGroupsOptions[index - 1].label}`
                : undefined,
              down:
                index < numberMemberGroupsOptions.length - 1
                  ? `Member Groups ${
                      numberMemberGroupsOptions[index + 1].label
                    }`
                  : undefined,
              right: `Member Number ${range(numberMemberGroups)[0]}`,
            },
          })

          return (
            <Flex key={index} direction="row" align="center" {...navigation}>
              <Radio
                key={`${option.value}` + index}
                id={`${option.value}` + index}
                value={option.value}
                label={option.label}
                onChange={() => {
                  changeNumberMemberGroupsHandler(
                    option.value,
                    'filterNumberOfMemberGroups',
                  )
                }}
                checked={
                  option.value === template.filterNumberOfMemberGroups || false
                }
              />
            </Flex>
          )
        })}
      </FilterElement>

      <FilterElement>
        <Label>Groups</Label>
        {range(template?.filterNumberOfMemberGroups || numberMemberGroups).map(
          (filterNumber, index) => {
            const navigation = register(`Member Number ${filterNumber}`, {
              resolve: () => {
                setFilterHandler(filterNumber, 'filterSelectedMemberGroups')
              },
              neighbors: {
                left: `Member Groups ${numberMemberGroupsOptions[0].label}`,
                up: index
                  ? `Member Number ${range(numberMemberGroups)[index - 1]}`
                  : undefined,
                down:
                  index < range(numberMemberGroups).length - 1
                    ? `Member Number ${range(numberMemberGroups)[index + 1]}`
                    : undefined,
                right: Object.keys(Market)[0],
              },
            })

            return (
              <Flex
                key={filterNumber}
                direction="row"
                align="center"
                {...navigation}
              >
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
            )
          },
        )}
      </FilterElement>

      <FilterElement>
        <Label>Markets</Label>
        {Object.values(Market).map((market, index) => {
          const navigation = register(market, {
            resolve: () => {
              setFilterHandler(market, 'filterMarkets')
            },
            neighbors: {
              left: `Member Number ${range(numberMemberGroups)[0]}`,
              up: index ? Object.keys(Market)[index - 1] : undefined,
              down:
                index < Object.keys(Market).length - 1
                  ? Object.keys(Market)[index + 1]
                  : undefined,
              right: `Outcome Filter`,
            },
          })

          return (
            <Flex key={market} direction="row" align="center" {...navigation}>
              <Checkbox
                label={market}
                checked={filterExists(market, 'filterMarkets')}
                onChange={() => setFilterHandler(market, 'filterMarkets')}
              />
              <span style={{ marginLeft: '0.5rem' }}>
                {MarketFlags[market]}
              </span>
            </Flex>
          )
        })}
      </FilterElement>
    </FilterWrapper>
  )
}
