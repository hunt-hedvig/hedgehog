import styled from '@emotion/styled'
import React from 'react'

const RedIcon = styled('i')({ color: '#FF8A80' })

const GreenIcon = styled('i')({ color: '#1BE9B6' })

export const Checkmark = () => <GreenIcon className="fas fa-check-circle" />

export const Cross = () => <RedIcon className="fas fa-times-circle" />

export const Ban = () => <RedIcon className="fas fa-ban" />

export const QuestionMark = () => <i className="fas fa-question-circle" />

export const ThumpsUp = () => <GreenIcon className="fas fa-thumbs-up" />

export const RedQuestionMark = () => (
  <RedIcon className="fas fa-question-circle" />
)
