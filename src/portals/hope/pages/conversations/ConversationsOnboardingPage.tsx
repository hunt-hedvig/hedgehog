import styled from '@emotion/styled'
import {
  Button,
  Fade,
  FadeIn,
  Flex,
  MainHeadline,
  Paragraph,
  useFadeAnimation,
} from '@hedvig-ui'
import {
  FilterSelect,
  FilterStateType,
} from 'portals/hope/features/questions/FilterSelect'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { UserSettingKey } from 'types/generated/graphql'
import { Page } from 'portals/hope/pages/routes'

const Subtext = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.placeholderColor};
`

const ConversationsOnboardingPage: Page = () => {
  const { fade, props: fadeProps } = useFadeAnimation({})
  const [onboardingStep, setOnboardingStep] = useState(0)
  const { settings, updateSetting } = useMe()

  const history = useHistory()

  const [selectedFilters, setSelectedFilters] = useState<number[]>([
    ...(settings.claimStatesFilterQuestions || []),
    ...(settings.memberGroupsFilterQuestions || []),
    ...(settings.marketFilterQuestions || []),
  ])

  useEffect(() => {
    if (!settings[UserSettingKey.FeatureFlags]?.conversations) {
      updateSetting(UserSettingKey.FeatureFlags, {
        ...settings[UserSettingKey.FeatureFlags],
        conversations: true,
      })

      history.go(0)
    }
  }, [])

  useEffect(() => {
    fade('up', 'in').then(() => {
      setTimeout(() => fade('up', 'out').then(() => setOnboardingStep(1)), 2000)
    })
  }, [])

  if (!settings[UserSettingKey.FeatureFlags]?.conversations) {
    return null
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
        ? currentValue?.filter((item: string | number) => item !== filter)
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

  if (onboardingStep === 0) {
    return (
      <Fade {...fadeProps}>
        {onboardingStep === 0 && (
          <Flex
            direction="column"
            align="center"
            fullWidth
            style={{
              marginBottom: '4.0em',
              marginTop: '24vh',
              textAlign: 'center',
            }}
          >
            <FadeIn delay="300ms">
              <MainHeadline>Conversations</MainHeadline>
            </FadeIn>
            <FadeIn delay="700ms">
              <Paragraph
                secondary
                style={{ fontSize: '0.95em', marginTop: '0.3em' }}
              >
                Introducing context to questions
              </Paragraph>
            </FadeIn>
          </Flex>
        )}
      </Fade>
    )
  }

  return (
    <Fade {...fadeProps}>
      <Flex
        direction="column"
        align="center"
        fullWidth
        style={{
          marginBottom: '4.0em',
          marginTop: '15vh',
          textAlign: 'center',
        }}
      >
        <FadeIn delay="300ms">
          <MainHeadline>Let's get you setup</MainHeadline>
        </FadeIn>
        <FadeIn delay="700ms">
          <Paragraph
            secondary
            style={{ fontSize: '0.95em', marginTop: '0.3em' }}
          >
            What kind of conversations do you want?
          </Paragraph>
        </FadeIn>
      </Flex>
      <FilterSelect filters={selectedFilters} onToggle={toggleFilterHandler} />
      {!!selectedFilters.length && (
        <FadeIn style={{ width: '100%' }}>
          <Flex
            direction="column"
            justify="center"
            align="center"
            style={{ marginTop: '4.0em' }}
          >
            <Button
              onClick={() => {
                fade('up', 'out').then(() => {
                  history.push('/conversations')
                })
              }}
              style={{ marginBottom: '0.5em', width: '300px' }}
            >
              Continue
            </Button>
            <Subtext>Don't worry, you can change these later</Subtext>
          </Flex>
        </FadeIn>
      )}
    </Fade>
  )
}

export default ConversationsOnboardingPage
