import React from 'react'
import styled from 'react-emotion'
import { FilteredQuestionGroups } from './FilteredQuestionGroups'
import { FilterState } from 'components/questions/filter'
import { isMemberIdEven} from 'utils/member'
import { useQuestionGroups } from 'graphql/use-question-groups'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
`

const doTeamFilter = (selectedFilters) => ({ memberId }) =>
  (selectedFilters.includes(FilterState.Even) && isMemberIdEven(memberId)) ||
  (selectedFilters.includes(FilterState.Odd) && !isMemberIdEven(memberId))

const doMarketFilter = (selectedFilters) => ({ member }) =>
  (selectedFilters.includes(FilterState.Sweden) && (member.contractMarketInfo?.market === "SWEDEN")) ||
  (selectedFilters.includes(FilterState.Norway) && (member.contractMarketInfo?.market === "NORWAY"))

const QuestionGroups = ({ selectedFilters }) => {
  const [questionGroups, { loading }] = useQuestionGroups()

  if (loading) {
    return <>Loading...</>
  }

  if (!questionGroups) {
    return <>Something went wrong :(</>
  }

  return (
    <ListContainer>
      <FilteredQuestionGroups
        filterQuestionGroups={questionGroups.filter(doTeamFilter(selectedFilters))
          .filter(doMarketFilter(selectedFilters))
        }
      />
    </ListContainer>
  )
}

export default QuestionGroups
