import { useMyMarkets } from 'portals/hope/common/hooks/use-my-markets'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { UserSettings } from 'types/generated/graphql'
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
    settingField: keyof UserSettings,
  ) => {
    const currentValue = settings[settingField]

    if (!Array.isArray(currentValue)) {
      return
    }

    updateSetting(
      settingField,
      (currentValue as number[])?.includes(filter)
        ? (currentValue as number[])?.filter(
            (item: string | number) => item !== filter,
          )
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
