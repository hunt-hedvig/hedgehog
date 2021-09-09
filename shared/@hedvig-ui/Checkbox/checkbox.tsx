import React from 'react'
import { Checkbox as SemanticCheckbox, CheckboxProps } from 'semantic-ui-react'

export const Checkbox: React.FC<CheckboxProps> = (props) => (
  <SemanticCheckbox {...props} />
)
