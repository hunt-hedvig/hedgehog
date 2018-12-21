import format from 'date-fns/format'
import { FieldProps } from 'formik'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'
import * as React from 'react'

export const DatePicker: React.SFC<FieldProps> = ({
  field: { value, name },
  form: { setFieldValue },
}) => (
  <MuiDatePicker
    autoOk
    keyboard={false}
    allowKeyboardControl={false}
    labelFunc={(date: Date) => format(date, 'yyyy-MM-dd')}
    onChange={(newValue: Date) => {
      setFieldValue(name, newValue)
    }}
    value={value}
    name={name}
    fullWidth
  />
)
