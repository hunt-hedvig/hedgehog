import React, { useContext } from 'react'
import styled from 'react-emotion'
import { FilteredQuestionGroups } from './FilteredQuestionGroups'
import {
  doClaimFilter,
  doMarketFilter,
  doTeamFilter,
} from 'utils/questionGroup'
import { NumberTeamsContext } from 'utils/number-teams-context'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
`

const QuestionGroups = ({ selectedFilters, questionGroups }) => {
  const { numberTeams } = useContext(NumberTeamsContext)
  return (
    <ListContainer>
      <FilteredQuestionGroups
        filterQuestionGroups={questionGroups
          .filter(doTeamFilter(numberTeams)(selectedFilters))
          .filter(doMarketFilter(selectedFilters))
          .filter(doClaimFilter(selectedFilters))}
      />
    </ListContainer>
  )
}

export default QuestionGroups
