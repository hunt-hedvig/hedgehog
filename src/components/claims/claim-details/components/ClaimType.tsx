import { Button, MenuItem } from '@material-ui/core'
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import { Field, FieldProps, Form, Formik } from 'formik'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'
import * as React from 'react'
import { Select, TextField } from './ClaimPayments'
import { CustomPaper } from './Styles'

const hasLocation = (typename: ClaimTypes): boolean => {
  return typename !== ClaimTypes.WaterDamageClaim
}

const hasItem = (typename: ClaimTypes): boolean => {
  return [ClaimTypes.TheftClaim, ClaimTypes.AccidentalDamageClaim].includes(
    typename,
  )
}

const hasPoliceReport = (typename: ClaimTypes): boolean => {
  return ![ClaimTypes.WaterDamageClaim, ClaimTypes.LuggageDelayClaim].includes(
    typename,
  )
}

const hasReceipt = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.TravelAccidentClaim,
  ].includes(typename)
}

const hasTicket = (typename: ClaimTypes): boolean => {
  return typename === ClaimTypes.LuggageDelayClaim
}

interface TheftClaim {
  location?: string
  date?: string
  item?: string
  policeReport?: string
  __typename: ClaimTypes
}

interface AccidentalDamageClaim {
  location?: string
  date?: string
  item?: string
  policeReport?: string
  receipt?: string
  __typename: ClaimTypes
}

interface AssaultClaim {
  location?: string
  date?: string
  policeReport?: string
  __typename: ClaimTypes
}

interface WaterDamageClaim {
  date?: string
  __typename: ClaimTypes
}

interface TravelAccidentClaim {
  location?: string
  date?: string
  policeReport?: string
  receipt?: string
  __typename: ClaimTypes
}

interface LuggageDelayClaim {
  location?: string
  date?: string
  ticket?: string
  __typename: ClaimTypes
}

export enum ClaimTypes {
  TheftClaim = 'TheftClaim',
  AccidentalDamageClaim = 'AccidentalDamageClaim',
  AssaultClaim = 'AssaultClaim',
  WaterDamageClaim = 'WaterDamageClaim',
  TravelAccidentClaim = 'TravelAccidentClaim',
  LuggageDelayClaim = 'LuggageDelayClaim',
}

type ClaimType =
  | TheftClaim
  | AccidentalDamageClaim
  | AssaultClaim
  | WaterDamageClaim
  | TravelAccidentClaim
  | LuggageDelayClaim

interface ClaimTypeProps {
  type?: ClaimType
  setClaimType: (type: ClaimTypes) => void
  setClaimInformation: (information: any) => void
}

const DatePickerField: React.SFC<FieldProps> = ({
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
  />
)

const ClaimType: React.SFC<ClaimTypeProps> = ({
  type,
  setClaimType,
  setClaimInformation,
}) => (
  <CustomPaper>
    <Formik<{ selectedType?: ClaimTypes | '' }>
      initialValues={{ selectedType: (type && type.__typename) || '' }}
      onSubmit={(values, { setSubmitting }) => {
        if (!values.selectedType) {
          return
        }
        setClaimType(values.selectedType)
        setSubmitting(false)
      }}
    >
      <Form>
        <div>
          <p>Type</p>
          <Field component={Select} name="selectedType">
            <MenuItem disabled value="">
              Select a type...
            </MenuItem>
            {Object.keys(ClaimTypes).map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Field>
        </div>
        <div>
          <Button type="submit" variant="contained" color="primary">
            Set type
          </Button>
        </div>
      </Form>
    </Formik>
    {type ? (
      <Formik<{
        location?: string
        date?: Date
        item?: string
        policeReport?: string
        receipt?: string
        ticket?: string
      }>
        initialValues={{
          location: (type as any).location,
          date: type.date ? toDate(type.date) : undefined,
          item: (type as any).item,
          policeReport: (type as any).policeReport,
          receipt: (type as any).receipt,
          ticket: (type as any).ticket,
        }}
        onSubmit={(values, { setSubmitting }) => {
          setClaimInformation({
            ...values,
            date: values.date && format(values.date, 'yyyy-MM-dd'),
          })
          setSubmitting(false)
        }}
      >
        <Form>
          {hasLocation(type.__typename) && (
            <div>
              <Field
                component={TextField}
                name="location"
                placeholder="Location"
              />
            </div>
          )}
          <div>
            <Field component={DatePickerField} name="date" placeholder="Date" />
          </div>
          {hasItem(type.__typename) && (
            <div>
              <Field component={TextField} name="item" placeholder="Item" />
            </div>
          )}
          {hasPoliceReport(type.__typename) && (
            <div>
              <Field
                component={TextField}
                name="policeReport"
                placeholder="Police Report"
              />
            </div>
          )}
          {hasReceipt(type.__typename) && (
            <div>
              <Field
                component={TextField}
                name="receipt"
                placeholder="Receipt"
              />
            </div>
          )}
          {hasTicket(type.__typename) && (
            <div>
              <Field component={TextField} name="ticket" placeholder="Ticket" />
            </div>
          )}
          <div>
            <Button type="submit" variant="contained" color="primary">
              Update claim information
            </Button>
          </div>
        </Form>
      </Formik>
    ) : null}
  </CustomPaper>
)

export { ClaimType }
