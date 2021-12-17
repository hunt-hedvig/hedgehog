import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { range } from '@hedvig-ui/utils/range'
import {
  FilterElement,
  FilterNumberMemberGroups,
} from 'features/claims/claims-list/FilterElements'
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
import React, { useEffect } from 'react'
import { ClaimComplexity, ClaimState } from 'types/generated/graphql'

interface ClaimListTemplateFiltersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  templateId: string
  template: ClaimsFiltersType
  editTemplate: (newFilter: ClaimsFiltersType, id?: string) => void
  navigationAvailable: boolean
}

export const ClaimListTemplateFilters: React.FC<
  ClaimListTemplateFiltersProps
> = ({ template, editTemplate, templateId, navigationAvailable, ...props }) => {
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

  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep: 3,
    isActive: navigationAvailable,
    vertical: false,
    withNegative: true,
  })

  useEffect(() => {
    if (!navigationAvailable) {
      reset()
    }
  }, [navigationAvailable])

  return (
    <FilterWrapper {...props}>
      <FilterElement
        active={navigationAvailable && navigationStep + 1 === 0}
        checked={(key) => filterExists(ClaimState[key], 'filterClaimStates')}
        onChange={(key) =>
          setFilterHandler(ClaimState[key], 'filterClaimStates')
        }
        onPerfom={(index) =>
          setFilterHandler(
            ClaimState[Object.keys(ClaimState)[index + 1]],
            'filterClaimStates',
          )
        }
        maxStep={Object.keys(ClaimState).length - 2}
        label="States"
        values={Object.keys(ClaimState)}
        getContent={(key) => (
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
        active={navigationAvailable && navigationStep + 1 === 1}
        checked={(key) =>
          filterExists(ClaimComplexity[key], 'filterComplexities')
        }
        onChange={(key) =>
          setFilterHandler(ClaimComplexity[key], 'filterComplexities')
        }
        onPerfom={(index) =>
          setFilterHandler(
            ClaimComplexity[Object.keys(ClaimComplexity)[index + 1]],
            'filterComplexities',
          )
        }
        maxStep={Object.keys(ClaimComplexity).length - 2}
        label="Complexities"
        popover="A complex claim either has a reserve over 50k or is of type Water, Fire, Liability, Legal Protection or Flooding."
        values={Object.keys(ClaimComplexity)}
        getContent={(key) => (
          <span style={{ marginLeft: '0.5rem' }}>{complexityIcons[key]}</span>
        )}
      />

      <FilterNumberMemberGroups
        active={navigationAvailable && navigationStep + 1 === 2}
        numberMemberGroups={template.filterNumberOfMemberGroups || undefined}
        setNumberMemberGroups={(value: number) => {
          changeNumberMemberGroupsHandler(value, 'filterNumberOfMemberGroups')
        }}
      />

      <FilterElement
        active={navigationAvailable && navigationStep + 1 === 3}
        checked={(filterNumber) =>
          filterExists(filterNumber, 'filterSelectedMemberGroups')
        }
        onChange={(filterNumber) =>
          setFilterHandler(filterNumber, 'filterSelectedMemberGroups')
        }
        onPerfom={(index) =>
          setFilterHandler(index + 1, 'filterSelectedMemberGroups')
        }
        maxStep={
          template.filterNumberOfMemberGroups
            ? template.filterNumberOfMemberGroups - 2
            : numberMemberGroups - 2
        }
        CheckboxLabel={FilterGroupState}
        label="Groups"
        values={range(
          template?.filterNumberOfMemberGroups || numberMemberGroups,
        )}
        getContent={(filterNumber) => (
          <MemberGroupColorBadge
            filter={+filterNumber}
            style={{ height: '0.7em', width: '0.7em' }}
          />
        )}
      />

      <FilterElement
        active={navigationAvailable && navigationStep + 1 === 4}
        checked={(key) => filterExists(Market[key], 'filterMarkets')}
        onChange={(key) => setFilterHandler(Market[key], 'filterMarkets')}
        onPerfom={(index) =>
          setFilterHandler(
            Market[Object.keys(Market)[index + 1]],
            'filterMarkets',
          )
        }
        maxStep={Object.keys(Market).length - 2}
        values={Object.keys(Market)}
        label="Markets"
        getContent={(key) => (
          <span style={{ marginLeft: '0.5rem' }}>
            {MarketFlags[key.toUpperCase()]}
          </span>
        )}
      />
    </FilterWrapper>
  )
}
