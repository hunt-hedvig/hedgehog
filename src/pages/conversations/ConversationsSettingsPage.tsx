import { Button, FadeIn, Flex } from '@hedvig-ui'
import { FilterSelect } from 'features/questions/FilterSelect'
import { useMe } from 'features/user/hooks/use-me'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { UserSettingKey } from 'types/generated/graphql'

const ConversationsSettingsPage: React.FC<{}> = () => {
  const history = useHistory()
  const { settings, updateSetting } = useMe()
  const [filters, setFilters] = useState(
    settings[UserSettingKey.FeatureFlags]?.questions_filters || [],
  )

  useEffect(() => {
    if (settings[UserSettingKey.FeatureFlags]?.questions_filters) {
      updateSetting(UserSettingKey.FeatureFlags, {
        ...settings[UserSettingKey.FeatureFlags],
        questions_filters: [...filters],
      })
    }
  }, [filters])

  console.log(settings)

  return (
    <>
      <div style={{ marginTop: '25vh' }} />
      <FilterSelect
        filters={filters}
        animationDelay={200}
        animationItemDelay={20}
        onToggle={(filter) => {
          if (filters.includes(filter)) {
            setFilters(filters.filter((prevFilter) => filter !== prevFilter))
          } else {
            setFilters([...filters, filter])
          }
        }}
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
