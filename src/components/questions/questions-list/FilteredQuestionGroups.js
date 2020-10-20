import PropTypes from 'prop-types'
import React from 'react'
import { Segment } from 'semantic-ui-react'
import styled from 'react-emotion'
import { QuestionGroup } from './QuestionGroup'
import { EaseIn } from 'hedvig-ui/animations/ease-in'
import { StandaloneMessage } from 'hedvig-ui/animations/standalone-message'

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
          {filterQuestionGroups.map((questionGroup, index) => (
            <EaseIn delay={`${index * 100}ms`}>
              <QuestionGroup
                key={questionGroup.id}
                questionGroup={questionGroup}
              />
            </EaseIn>
          ))}
        </>
      ) : (
        <StandaloneMessage paddingTop="25vh">List is empty</StandaloneMessage>
      )}
    </List>
  )
}

FilteredQuestionGroups.propTypes = {
  filterQuestionGroups: PropTypes.array.isRequired,
}
