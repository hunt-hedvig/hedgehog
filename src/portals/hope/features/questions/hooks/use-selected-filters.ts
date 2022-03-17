import { useMyMarkets } from 'portals/hope/common/hooks/use-my-markets'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { UserSettingKey } from 'types/generated/graphql'
import { useState } from 'react'
import { Market } from 'portals/hope/features/config/constants'
import { FilterStateType } from 'portals/hope/features/questions/FilterSelect'

export const useSelectedFilters = () => {
  const { markets: userMarkets } = useMyMarkets()
  const { settings, updateSetting } = useMe()

  const [selectedFilters, setSelectedFilters] = useState<number[]>([
    ...(settings.claimStatesFilterQuestions || []),
    ...(settings.memberGroupsFilterQuestions || []),
    ...(settings.marketFilterQuestions || []),
  ])

  const intermediateMarketFilterMap: Record<number, Market> = {
    6: Market.Sweden,
    7: Market.Norway,
    8: Market.Denmark,
  }

  const toggleFilterHandler = (
    filter: FilterStateType,
    settingField: UserSettingKey,
  ) => {
    const currentValue = settings[settingField]

    if (typeof currentValue !== 'object') {
      return
    }

    updateSetting(
      settingField,
      currentValue?.includes(filter)
        ? currentValue?.filter((item) => item !== filter)
        : [...(currentValue || []), filter],
    )

    if (selectedFilters.includes(filter)) {
      setSelectedFilters(
        selectedFilters.filter((prevFilter) => filter !== prevFilter),
      )
    } else {
      setSelectedFilters([...selectedFilters, filter])
    }
  }

  return {
    selectedFilters: selectedFilters.filter((filter) => {
      if (filter >= 6 && filter <= 8) {
        return userMarkets.includes(intermediateMarketFilterMap[filter])
      }
      return true
    }),
    toggleFilter: toggleFilterHandler,
  }
}
