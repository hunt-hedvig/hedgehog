import { TextField as MuiTextField } from '@material-ui/core'
import { FieldProps } from 'formik'
import * as React from 'react'

export interface TextFieldProps {
  placeholder: string
}

export const TextField: React.SFC<FieldProps & TextFieldProps> = ({
  field: { onChange, onBlur, name, value },
  placeholder,
}) => (
  <MuiTextField
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    value={value || ''}
    placeholder={placeholder}
    autoComplete="off"
    fullWidth
  />
)
