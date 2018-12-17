import * as React from 'react'
import styled from 'react-emotion'

const RedIcon = styled('i')({ color: '#ff0000' })

const GreenIcon = styled('i')({ color: '#00ff00' })

export const Checkmark = () => <GreenIcon className="fas fa-check-circle" />

export const Cross = () => <RedIcon className="fas fa-times-circle" />

export const Ban = () => <RedIcon className="fas fa-ban" />

export const QuestionMark = () => <i className="fas fa-question-circle" />

export const ThumpsUp = () => <GreenIcon className="fas fa-thumbs-up" />

export const RedQuestionMark = () => (
  <RedIcon className="fas fa-question-circle" />
)
