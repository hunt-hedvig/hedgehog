import { TextField as MuiTextField } from '@material-ui/core'
import { FieldProps } from 'formik'
import React from 'react'

export interface TextFieldProps {
  placeholder: string
  label?: string
}

export const TextField: React.SFC<FieldProps & TextFieldProps> = ({
  field: { onChange, onBlur, name, value },
  placeholder,
  label,
}) => (
  <MuiTextField
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    label={label}
    value={value || ''}
    placeholder={placeholder}
    autoComplete="off"
    fullWidth
  />
)
