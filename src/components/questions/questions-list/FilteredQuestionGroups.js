import PropTypes from 'prop-types'
import React from 'react'
import { Header, Segment } from 'semantic-ui-react'
import styled from 'react-emotion'
import { QuestionGroup } from './QuestionGroup'

const List = styled(Segment)`
  width: 100%;
  &&& {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
`

export const FilteredQuestionGroups = ({ filterQuestionGroups }) => {
  return (
    <List>
      {filterQuestionGroups.length ? (
        <>
          {filterQuestionGroups.map((questionGroup) => (
            <QuestionGroup
              key={questionGroup.id}
              questionGroup={questionGroup}
            />
          ))}
        </>
      ) : (
        <Header>List is empty</Header>
      )}
    </List>
  )
}

FilteredQuestionGroups.propTypes = {
  filterQuestionGroups: PropTypes.array.isRequired,
}
