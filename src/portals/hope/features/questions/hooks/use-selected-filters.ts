import { useMyMarkets } from 'portals/hope/common/hooks/use-my-markets'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { UserSettingKey } from 'types/generated/graphql'
import { useState } from 'react'
import { Market } from 'portals/hope/features/config/constants'
import { FilterStateType } from 'portals/hope/features/questions/FilterSelect'

export const useSelectedFilters = () => {
  const { markets: userMarkets } = useMyMarkets()
  const { settings, updateSetting } = useMe()

  const getQuestionsFilter = (field: UserSettingKey) =>
    (settings[field] && settings[field].questions) || []

  const [selectedFilters, setSelectedFilters] = useState<number[]>([
    ...getQuestionsFilter(UserSettingKey.ClaimStatesFilter),
    ...getQuestionsFilter(UserSettingKey.MemberGroupsFilter),
    ...getQuestionsFilter(UserSettingKey.ClaimComplexityFilter),
    ...getQuestionsFilter(UserSettingKey.MarketFilter),
  ])

  const intermediateMarketFilterMap: Record<number, Market> = {
    6: Market.Sweden,
    7: Market.Norway,
    8: Market.Denmark,
  }

  const toggleFilterHandler = (
    filter: FilterStateType,
    settingField?: UserSettingKey,
  ) => {
    if (settingField) {
      if (settings[settingField] && settings[settingField].questions) {
        updateSetting(settingField, {
          ...settings[settingField],
          questions: settings[settingField].questions.includes(filter)
            ? settings[settingField].questions.filter(
                (prevFilter: number) => filter !== prevFilter,
              )
            : [...settings[settingField].questions, filter],
        })
      } else {
        updateSetting(settingField, {
          ...settings[settingField],
          questions: [filter],
        })
      }
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
      if (filter >= 6 && filter <= 8) {
        return userMarkets.includes(intermediateMarketFilterMap[filter])
      }
      return true
    }),
    toggleFilter: toggleFilterHandler,
  }
}
