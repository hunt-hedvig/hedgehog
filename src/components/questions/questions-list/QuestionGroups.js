import React, { useContext } from 'react'
import styled from 'react-emotion'
import { FilteredQuestionGroups } from './FilteredQuestionGroups'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'utils/questionGroup'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
`

const QuestionGroups = ({ selectedFilters, questionGroups }) => {
  const { numberMemberGroups } = useNumberMemberGroups()
  return (
    <ListContainer>
      <FilteredQuestionGroups
        filterQuestionGroups={questionGroups
          .filter(doMemberGroupFilter(numberMemberGroups)(selectedFilters))
          .filter(doMarketFilter(selectedFilters))
          .filter(doClaimFilter(selectedFilters))}
      />
    </ListContainer>
  )
}

export default QuestionGroups
