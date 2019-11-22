import format from 'date-fns/format'
import { FieldProps } from 'formik'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'
import * as React from 'react'

export const FormikDatePicker: React.SFC<FieldProps> = ({
  field: { value, name },
  form: { setFieldValue },
}) => (
  <BaseDatePicker
    onChange={(newValue: Date) => {
      setFieldValue(name, newValue)
    }}
    value={value}
    name={name}
  />
)

export const BaseDatePicker = props => (
  <MuiDatePicker
    autoOk
    keyboard={false}
    allowKeyboardControl={false}
    labelFunc={(date: Date) => date ? format(date, 'yyyy-MM-dd') : ''}
    fullWidth
    {...props}
  />
)
