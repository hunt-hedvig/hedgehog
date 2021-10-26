import styled from '@emotion/styled'
import {
  Capitalized,
  FadeIn,
  LoadingMessage,
  Spacing,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { FilterState, QuestionsFilter } from 'features/questions/filter'
import { NumberMemberGroupsRadioButtons } from 'features/questions/number-member-groups-radio-buttons'
import { QuestionGroups } from 'features/questions/questions-list/QuestionGroups'
import { useQuestionGroups } from 'graphql/use-question-groups'
import { getLowercaseNameFromEmail } from 'pages/DashboardPage'
import React from 'react'
import { useHistory } from 'react-router'
import { useGetMeQuery } from 'types/generated/graphql'
import { useInsecurePersistentState } from 'utils/state'

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
  const { data } = useGetMeQuery()
  const [selectedFilters, setSelectedFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [
    FilterState.First,
    FilterState.Second,
    FilterState.Third,
    FilterState.Sweden,
    FilterState.Norway,
    FilterState.HasOpenClaim,
    FilterState.NoOpenClaim,
  ])

  const [questionGroups, { loading }] = useQuestionGroups()

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
      {data?.me && (
        <ConversationsMessage
          onClick={() => {
            history.push('/conversations/onboarding')
          }}
        >
          Hey there{' '}
          <Capitalized>
            {getLowercaseNameFromEmail(data?.me.user.email)}
          </Capitalized>
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
              <strong>Number of member groups:</strong>
            </ThirdLevelHeadline>
            <NumberMemberGroupsRadioButtons />
          </Spacing>
          <QuestionsFilter
            questionGroups={questionGroups}
            selected={selectedFilters}
            onToggle={(newFilter) => {
              if (selectedFilters.includes(newFilter)) {
                setSelectedFilters(
                  selectedFilters.filter((filter) => filter !== newFilter),
                )
              } else {
                setSelectedFilters([...selectedFilters, newFilter])
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
