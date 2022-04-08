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
    4: Market.Sweden,
    5: Market.Norway,
    6: Market.Denmark,
  }

  const toggleFilterHandler = (
    filter: FilterStateType,
    settingField: keyof UserSettings,
  ) => {
    const currentValue = settings[settingField] as number[]

    if (currentValue?.includes(filter)) {
      updateSetting(
        settingField,
        currentValue?.filter((item: string | number) => item !== filter),
      )
    } else {
      updateSetting(settingField, [...(currentValue || []), filter])
    }

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
      if (filter >= 4 && filter <= 6) {
        return userMarkets.includes(intermediateMarketFilterMap[filter])
      }
      return true
    }),
    toggleFilter: toggleFilterHandler,
  }
}
