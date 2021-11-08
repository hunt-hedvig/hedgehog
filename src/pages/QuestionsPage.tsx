import styled from '@emotion/styled'
import {
  Capitalized,
  FadeIn,
  LoadingMessage,
  Spacing,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import {
  FilterSelect,
  FilterState,
  FilterStateType,
} from 'features/questions/FilterSelect'
import { useQuestionGroups } from 'features/questions/hooks/use-question-groups'
import { NumberMemberGroupsRadioButtons } from 'features/questions/number-member-groups-radio-buttons'
import { QuestionGroups } from 'features/questions/questions-list/QuestionGroups'
import { useMe } from 'features/user/hooks/use-me'
import { getLowercaseNameFromEmail } from 'pages/dashboard/DashboardPage'
import React from 'react'
import { useHistory } from 'react-router'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
`

const ConversationsMessage = styled.div`
  background-color: ${({ theme }) => theme.highlight};
  border: 1px solid ${({ theme }) => theme.highlight};
  color: ${({ theme }) => theme.darkHighlight};
  padding: 1em;
  border-radius: 8px;
  cursor: pointer;
  transition: all 200ms;

  :hover {
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.darkHighlight};
  }
`

const QuestionsPage: React.FC = () => {
  const history = useHistory()
  const [selectedFilters, setSelectedFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterStateType>
  >('questions:filters', [FilterState.HasOpenClaim, FilterState.NoOpenClaim])

  const [questionGroups, { loading }] = useQuestionGroups()
  const { me } = useMe()

  if (loading) {
    return <LoadingMessage paddingTop="25vh" />
  }

  if (!questionGroups) {
    return (
      <StandaloneMessage paddingTop="25vh">
        Something went wrong!
      </StandaloneMessage>
    )
  }

  return (
    <ListPage>
      {me && (
        <ConversationsMessage
          onClick={() => {
            history.push('/conversations/onboarding')
          }}
        >
          Hey there{' '}
          <Capitalized>{getLowercaseNameFromEmail(me.email)}</Capitalized>
          !
          <br />
          <span style={{ fontSize: '0.9em' }}>
            We're testing a new version of the question page, want to try it?
          </span>
        </ConversationsMessage>
      )}
      <Spacing bottom="large" top="large">
        <FadeIn>
          <Spacing bottom>
            <ThirdLevelHeadline>
              <strong>Number of member groups</strong>
            </ThirdLevelHeadline>
            <NumberMemberGroupsRadioButtons />
          </Spacing>
          <FilterSelect
            filters={selectedFilters}
            pushLeft
            animationDelay={0}
            animationItemDelay={20}
            onToggle={(filter) => {
              if (selectedFilters.includes(filter)) {
                setSelectedFilters(
                  selectedFilters.filter((prevFilter) => filter !== prevFilter),
                )
              } else {
                setSelectedFilters([...selectedFilters, filter])
              }
            }}
          />
        </FadeIn>
      </Spacing>

      <QuestionGroups
        selectedFilters={selectedFilters}
        questionGroups={questionGroups}
      />
    </ListPage>
  )
}

export default QuestionsPage
