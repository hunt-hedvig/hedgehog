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
import { FilterSelect } from 'features/conversations/FilterSelect'
import { FilterState } from 'features/questions/filter'
import { useMe } from 'features/user/hooks/use-me'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { UserSettingKey } from 'types/generated/graphql'
import { useInsecurePersistentState } from 'utils/state'

const Subtext = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.placeholderColor};
`

const ConversationsOnboardingPage: React.FC = () => {
  const { fade, props: fadeProps } = useFadeAnimation({})
  const [onboardingStep, setOnboardingStep] = useState(0)
  const { settings, updateSetting } = useMe()

  const history = useHistory()
  const [enabledStorage, setEnabledStorage] = useInsecurePersistentState<
    boolean
  >('conversations:enabled', false)
  const [enabled, setEnabled] = useState(
    settings[UserSettingKey.FeatureFlags]?.conversations || false,
  )

  const [filters, setFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [])

  useEffect(() => {
    if (!enabled) {
      updateSetting(UserSettingKey.FeatureFlags, {
        conversations: true,
      })
      setEnabled(true)
    }
    if (!enabledStorage) {
      setEnabledStorage(true)
      history.go(0)
    }
  }, [enabled])

  useEffect(() => {
    fade('up', 'in').then(() => {
      setTimeout(() => fade('up', 'out').then(() => setOnboardingStep(1)), 2000)
    })
  }, [])

  if (!enabled) {
    return null
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
      <FilterSelect
        filters={filters}
        onToggle={(filter) => {
          if (filters.includes(filter)) {
            setFilters(filters.filter((prevFilter) => filter !== prevFilter))
          } else {
            setFilters([...filters, filter])
          }
        }}
      />
      {!!filters.length && (
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
