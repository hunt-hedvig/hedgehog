import { Button, MenuItem } from '@material-ui/core'
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import { Field, FieldProps, Form, Formik } from 'formik'
import gql from 'graphql-tag'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import { Select, TextField } from './ClaimPayments'
import { CustomPaper } from './Styles'

export const TYPE_FRAGMENT = `
        __typename
        ... on TheftClaim {
          location
          date
          item
          policeReport
          receipt
        }
        ... on AccidentalDamageClaim {
          location
          date
          item
          policeReport
          receipt
        }
        ... on AssaultClaim {
          location
          date
          policeReport
        }
        ... on WaterDamageClaim {
          date
        }
        ... on TravelAccidentClaim {
          location
          date
          policeReport
          receipt
        }
        ... on LuggageDelayClaim {
          location
          date
          ticket
        }
        ... on NotCoveredClaim {
          date
        }
`

const SET_CLAIM_TYPE_QUERY = gql`
  query SetClaimType($id: ID!) {
    claim(id: $id) {
      type {
        ${TYPE_FRAGMENT}
      }
      events {
        text
        date
      }
    }
  }
`

const SET_CLAIM_TYPE_MUTATION = gql`
  mutation SetClaimType($id: ID!, $type: ClaimTypes!) {
    setClaimType(id: $id, type: $type) {
      type {
        ${TYPE_FRAGMENT}
      }
      events {
        text
        date
      }
    }
  }
`

const SET_CLAIM_INFORMATION = gql`
  mutation SetClaimInformation($id: ID!, $claimInformation: ClaimInformationInput!) {
    setClaimInformation(id: $id, information: $claimInformation) {
      type {
        ${TYPE_FRAGMENT}
      }
      events {
        text
        date
      }
    }
  }
`

const SET_CLAIM_INFORMATION_QUERY = gql`
  query SetClaimInformation($id: ID!) {
    claim(id: $id) {
      type {
        ${TYPE_FRAGMENT}
      }
      events {
        text
        date
      }
    }
  }
`

const hasLocation = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.TheftClaim,
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.AssaultClaim,
    ClaimTypes.TravelAccidentClaim,
    ClaimTypes.LuggageDelayClaim,
  ].includes(typename)
}

const hasItem = (typename: ClaimTypes): boolean => {
  return [ClaimTypes.TheftClaim, ClaimTypes.AccidentalDamageClaim].includes(
    typename,
  )
}

const hasPoliceReport = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.TheftClaim,
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.AssaultClaim,
    ClaimTypes.TravelAccidentClaim,
  ].includes(typename)
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

interface NotCoveredClaim {
  date?: string
  __typename: ClaimTypes
}

export enum ClaimTypes {
  TheftClaim = 'TheftClaim',
  AccidentalDamageClaim = 'AccidentalDamageClaim',
  AssaultClaim = 'AssaultClaim',
  WaterDamageClaim = 'WaterDamageClaim',
  TravelAccidentClaim = 'TravelAccidentClaim',
  LuggageDelayClaim = 'LuggageDelayClaim',
  NotCoveredClaim = 'NotCoveredClaim',
}

type ClaimType =
  | TheftClaim
  | AccidentalDamageClaim
  | AssaultClaim
  | WaterDamageClaim
  | TravelAccidentClaim
  | LuggageDelayClaim
  | NotCoveredClaim

interface ClaimTypeProps {
  type?: ClaimType
  claimId: string
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

const ClaimType: React.SFC<ClaimTypeProps> = ({ type, claimId }) => (
  <Mutation
    mutation={SET_CLAIM_TYPE_MUTATION}
    update={(cache, { data: updateData }) => {
      cache.writeQuery({
        query: SET_CLAIM_TYPE_QUERY,
        variables: { id: claimId },
        data: {
          claim: {
            type: updateData.setClaimType.type,
            events: updateData.setClaimType.events,
            __typename: updateData.setClaimType.__typename,
          },
        },
      })
    }}
  >
    {(setClaimType) => (
      <Mutation
        mutation={SET_CLAIM_INFORMATION}
        update={(cache, { data: updateData }) => {
          cache.writeQuery({
            query: SET_CLAIM_INFORMATION_QUERY,
            variables: { id: claimId },
            data: {
              claim: {
                type: updateData.setClaimInformation.type,
                events: updateData.setClaimInformation.events,
                __typename: updateData.setClaimInformation.__typename,
              },
            },
          })
        }}
      >
        {(setClaimInformation) => (
          <CustomPaper>
            <Formik<{ selectedType?: ClaimTypes | '' }>
              initialValues={{ selectedType: (type && type.__typename) || '' }}
              onSubmit={(values, { setSubmitting }) => {
                if (!values.selectedType) {
                  return
                }
                setClaimType({
                  variables: { id: claimId, type: values.selectedType },
                })
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
                    variables: {
                      id: claimId,
                      claimInformation: {
                        ...values,
                        date: values.date && format(values.date, 'yyyy-MM-dd'),
                      },
                    },
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
                    <Field
                      component={DatePickerField}
                      name="date"
                      placeholder="Date"
                    />
                  </div>
                  {hasItem(type.__typename) && (
                    <div>
                      <Field
                        component={TextField}
                        name="item"
                        placeholder="Item"
                      />
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
                      <Field
                        component={TextField}
                        name="ticket"
                        placeholder="Ticket"
                      />
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
        )}
      </Mutation>
    )}
  </Mutation>
)

export { ClaimType }
