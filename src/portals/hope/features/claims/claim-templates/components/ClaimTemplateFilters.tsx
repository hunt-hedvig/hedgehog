import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { range } from '@hedvig-ui/utils/range'
import {
  complexityIcons,
  FilterGroupState,
  FilterWrapper,
  stateColors,
} from 'portals/hope/features/claims/claims-list/filters/ClaimListFilters'
import { Market, MarketFlags } from 'portals/hope/features/config/constants'
import { FocusItems } from 'portals/hope/features/navigation/hooks/use-navigation'
import { MemberGroupColorBadge } from 'portals/hope/features/questions/MemberGroupColorBadge'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { ClaimsFiltersType } from 'portals/hope/pages/claims/list/ClaimsListPage'
import React, { useEffect } from 'react'
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
  navigationAvailable: boolean
  setFocus: (focus: string) => void
}

export const ClaimTemplateFilters: React.FC<ClaimTemplateFiltersProps> = ({
  filters,
  setFilters,
  page,
  navigationAvailable,
  setFocus,
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

  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep: 4,
    isActive: navigationAvailable,
    onNavigationStep: () => {
      if (navigationStep === 4) {
        setFocus(FocusItems.Main.items.ModalSubmit)
      }
    },
    direction: 'horizontal',
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
        onRender={(key) => (
          <span style={{ marginLeft: '0.5rem' }}>{complexityIcons[key]}</span>
        )}
      />

      <FilterNumberMemberGroups
        active={navigationAvailable && navigationStep + 1 === 2}
        numberMemberGroups={filters.filterNumberOfMemberGroups || undefined}
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
          filters.filterNumberOfMemberGroups
            ? filters.filterNumberOfMemberGroups - 2
            : numberMemberGroups - 2
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
        active={navigationAvailable && navigationStep + 1 === 4}
        checked={(key) => filterExists(Market[key], 'filterMarkets')}
        onChange={(key) => setFilterHandler(Market[key], 'filterMarkets')}
        onPerfom={(index) =>
          setFilterHandler(
            Market[Object.keys(Market)[index + 1]],
            'filterMarkets',
          )
        }
        maxStep={Object.keys(Market).length - 1}
        onNavigationStep={(step: number) => {
          if (step === 2) {
            setFocus(FocusItems.Main.items.ModalSubmit)
          }
        }}
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
