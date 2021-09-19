import styled from '@emotion/styled'
import { Button, FadeIn, Flex, MainHeadline, Paragraph } from '@hedvig-ui'
import { FilterSelect } from 'features/conversations/FilterSelect'
import { FilterState } from 'features/questions/filter'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useInsecurePersistentState } from 'utils/state'

const Subtext = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.placeholderColor};
`

export const ConversationsOnboardingPage: React.FC = () => {
  const history = useHistory()
  const [enabled] = useInsecurePersistentState<boolean>(
    'conversations:enabled',
    false,
  )
  const [, setOnboarded] = useInsecurePersistentState<boolean>(
    'conversations:onboarded',
    false,
  )
  const [filters, setFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [])

  useEffect(() => {
    if (!enabled) {
      localStorage.setItem(`hvg:conversations:enabled`, JSON.stringify(true))
      history.go(0)
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <>
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
        <FadeIn delay={'300ms'}>
          <MainHeadline>Let's get you setup</MainHeadline>
        </FadeIn>
        <FadeIn delay={'700ms'}>
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
            justify={'center'}
            align={'center'}
            style={{ marginTop: '4.0em' }}
          >
            <Button
              onClick={() => {
                setOnboarded(true)
                history.push('/conversations')
              }}
              variation={'primary'}
              style={{ marginBottom: '0.5em', width: '300px' }}
            >
              Continue
            </Button>
            <Subtext>Don't worry, you can change these later</Subtext>
          </Flex>
        </FadeIn>
      )}
    </>
  )
}
