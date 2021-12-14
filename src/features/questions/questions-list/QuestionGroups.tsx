import styled from '@emotion/styled'
import {
  doClaimFilter,
  doMarketFilter,
  doMemberGroupFilter,
} from 'features/questions/utils'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import React from 'react'
import { FilteredQuestionGroups } from './FilteredQuestionGroups'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
`

export const QuestionGroups = ({
  selectedFilters,
  questionGroups,
  navigationAvailable,
}) => {
  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <ListContainer>
      <FilteredQuestionGroups
        navigationAvailable={navigationAvailable}
        filterQuestionGroups={
          selectedFilters.length > 0
            ? questionGroups
                .filter(
                  doMemberGroupFilter(numberMemberGroups)(selectedFilters),
                )
                .filter(doMarketFilter(selectedFilters))
                .filter(doClaimFilter(selectedFilters))
            : questionGroups
        }
      />
    </ListContainer>
  )
}
