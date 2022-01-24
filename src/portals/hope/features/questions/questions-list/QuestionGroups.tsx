import styled from '@emotion/styled'
import {
  doMarketFilter,
  doMemberGroupFilter,
} from 'portals/hope/features/questions/utils'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import React from 'react'
import { FilteredQuestionGroups } from './FilteredQuestionGroups'
import { QuestionGroup } from 'types/generated/graphql'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
`

export const QuestionGroups: React.FC<{
  selectedFilters: number[]
  questionGroups: QuestionGroup[]
}> = ({ selectedFilters, questionGroups }) => {
  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <ListContainer>
      <FilteredQuestionGroups
        filterQuestionGroups={
          selectedFilters.length > 0
            ? questionGroups
                .filter(
                  doMemberGroupFilter(numberMemberGroups)(selectedFilters),
                )
                .filter(doMarketFilter(selectedFilters))
            : questionGroups
        }
      />
    </ListContainer>
  )
}
