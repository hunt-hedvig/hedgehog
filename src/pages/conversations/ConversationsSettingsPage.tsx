import { Button, FadeIn, Flex } from '@hedvig-ui'
import { FilterSelect, FilterStateType } from 'features/questions/FilterSelect'
import { useMe } from 'features/user/hooks/use-me'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { UserSettingKey } from 'types/generated/graphql'

const ConversationsSettingsPage: React.FC<{}> = () => {
  const history = useHistory()
  const { settings, updateSetting } = useMe()
  const [filters, setFilters] = useState([
    ...settings[UserSettingKey.ClaimStatesFilter].questions,
    ...settings[UserSettingKey.MemberGroupsFilter].questions,
    ...settings[UserSettingKey.ClaimComplexityFilter].questions,
    ...settings[UserSettingKey.MarketFilter].questions,
  ])

  const setEmptyFilter = (field) => {
    if (!settings[field].questions) {
      updateSetting(field, {
        ...settings[field],
        questions: [],
      })
    }
  }

  useEffect(() => {
    setEmptyFilter(UserSettingKey.ClaimStatesFilter)
    setEmptyFilter(UserSettingKey.MemberGroupsFilter)
    setEmptyFilter(UserSettingKey.ClaimComplexityFilter)
    setEmptyFilter(UserSettingKey.MarketFilter)
  }, [])

  const toggleFilterHandler = (
    filter: FilterStateType,
    settingField?: UserSettingKey,
  ) => {
    if (settingField) {
      updateSetting(settingField, {
        ...settings[settingField],
        questions: settings[settingField].questions.includes(filter)
          ? settings[settingField].questions.filter(
              (prevFilter) => filter !== prevFilter,
            )
          : [...settings[settingField].questions, filter],
      })
    }

    if (filters.includes(filter)) {
      setFilters(filters.filter((prevFilter) => filter !== prevFilter))
    } else {
      setFilters([...filters, filter])
    }
  }

  return (
    <>
      <div style={{ marginTop: '25vh' }} />
      <FilterSelect
        filters={filters}
        animationDelay={200}
        animationItemDelay={20}
        onToggle={toggleFilterHandler}
      />
      <FadeIn style={{ width: '100%' }}>
        <Flex
          direction="column"
          justify="center"
          align="center"
          style={{ marginTop: '4.0em' }}
        >
          <Button
            onClick={() => history.push('/conversations')}
            style={{ marginBottom: '0.5em', width: '300px' }}
          >
            Done
          </Button>
        </Flex>
      </FadeIn>
    </>
  )
}

export default ConversationsSettingsPage
