import React, { useContext } from 'react'
import styled from 'react-emotion'
import { FilteredQuestionGroups } from './FilteredQuestionGroups'
import {
  doClaimFilter,
  doMarketFilter,
  doColorFilter,
} from 'utils/questionGroup'
import { NumberColorsContext } from 'utils/number-colors-context'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
`

const QuestionGroups = ({ selectedFilters, questionGroups }) => {
  const { numberColors } = useContext(NumberColorsContext)
  return (
    <ListContainer>
      <FilteredQuestionGroups
        filterQuestionGroups={questionGroups
          .filter(doColorFilter(numberColors)(selectedFilters))
          .filter(doMarketFilter(selectedFilters))
          .filter(doClaimFilter(selectedFilters))}
      />
    </ListContainer>
  )
}

export default QuestionGroups
