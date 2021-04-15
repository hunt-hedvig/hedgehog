import { Select as MuiSelect } from '@material-ui/core'
import { FieldProps } from 'formik'
import React from 'react'

export const FieldSelect: React.SFC<FieldProps> = ({
  field: { onChange, onBlur, name, value },
  children,
}) => (
  <MuiSelect
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    value={value}
    fullWidth
  >
    {children}
  </MuiSelect>
)
